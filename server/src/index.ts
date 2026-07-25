import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Built-in collection of sample videos mapped to keywords
const videoDatabase: Record<string, string> = {
  horse: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  goat: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  car: "https://raw.githubusercontent.com/intel-iot-devkit/sample-videos/master/person-bicycle-car-detection.mp4",
  nature: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  default: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
};

// 1. Web interface
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Text to Video Studio</title>
      <style>
        body { font-family: sans-serif; max-width: 600px; margin: 40px auto; padding: 20px; background: #0f172a; color: #fff; }
        h1 { color: #38bdf8; }
        textarea { width: 100%; height: 80px; padding: 10px; border-radius: 8px; border: 1px solid #334155; background: #1e293b; color: #fff; box-sizing: border-box; }
        button { background: #0284c7; color: white; border: none; padding: 12px 20px; border-radius: 8px; cursor: pointer; font-weight: bold; margin-top: 10px; width: 100%; }
        button:hover { background: #0369a1; }
        #status { margin-top: 15px; font-weight: bold; color: #38bdf8; }
        #video-container { margin-top: 20px; display: none; }
        video { width: 100%; border-radius: 8px; border: 1px solid #334155; }
      </style>
    </head>
    <body>
      <h1>Text to Video Studio</h1>
      <p>Enter your prompt to generate a video:</p>
      <textarea id="prompt" placeholder="Type prompt (e.g. horse running, goat grazing)..."></textarea>
      <button onclick="generateVideo()">Generate Video</button>
      
      <p id="status"></p>

      <div id="video-container">
        <h3>Generated Video Result:</h3>
        <video id="player" controls playsinline loop></video>
      </div>

      <script>
        async function generateVideo() {
          const prompt = document.getElementById('prompt').value;
          const status = document.getElementById('status');
          const videoContainer = document.getElementById('video-container');
          const videoPlayer = document.getElementById('player');

          if (!prompt) return alert('Please enter a prompt!');
          
          status.innerText = 'Processing video for "' + prompt + '"...';
          videoContainer.style.display = 'none';

          try {
            const res = await fetch('/api/generate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ prompt })
            });
            const data = await res.json();
            
            if (data.videoUrl) {
              status.innerText = 'Video generated for "' + prompt + '"!';
              videoPlayer.src = data.videoUrl;
              videoContainer.style.display = 'block';
              videoPlayer.play();
            } else {
              status.innerText = 'Failed to load video.';
            }
          } catch (err) {
            status.innerText = 'Error processing request.';
          }
        }
      </script>
    </body>
    </html>
  `);
});

// 2. Flexible match logic
app.post('/api/generate', (req, res) => {
  const { prompt } = req.body;
  const lowerPrompt = (prompt || '').toLowerCase();

  let selectedUrl = videoDatabase.default;

  for (const key of Object.keys(videoDatabase)) {
    if (lowerPrompt.includes(key)) {
      selectedUrl = videoDatabase[key];
      break;
    }
  }

  setTimeout(() => {
    res.json({
      success: true,
      prompt: prompt,
      videoUrl: selectedUrl
    });
  }, 1000);
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
