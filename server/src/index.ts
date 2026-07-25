import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

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
      <textarea id="prompt" placeholder="Type your prompt (e.g. horse running)..."></textarea>
      <button onclick="generateVideo()">Generate Video</button>
      
      <p id="status"></p>

      <div id="video-container">
        <h3 id="video-title">Generated Video:</h3>
        <video id="player" controls playsinline loop></video>
      </div>

      <script>
        async function generateVideo() {
          const prompt = document.getElementById('prompt').value;
          const status = document.getElementById('status');
          const videoContainer = document.getElementById('video-container');
          const videoPlayer = document.getElementById('player');

          if (!prompt) return alert('Please enter a prompt!');
          
          status.innerText = 'Searching and generating video for "' + prompt + '"...';
          videoContainer.style.display = 'none';

          try {
            const res = await fetch('/api/generate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ prompt })
            });
            const data = await res.json();
            
            if (data.videoUrl) {
              status.innerText = 'Video matching "' + prompt + '" loaded successfully!';
              videoPlayer.src = data.videoUrl;
              videoContainer.style.display = 'block';
              videoPlayer.play();
            } else {
              status.innerText = 'No videos found for that prompt. Try another phrase!';
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

// 2. Fetch video matching the prompt using free API
app.post('/api/generate', async (req, res) => {
  const { prompt } = req.body;
  
  try {
    // Free search API endpoint for stock videos matching prompt
    const response = await fetch(`https://api.pexels.com/videos/search?query=${encodeURIComponent(prompt)}&per_page=1`, {
      headers: {
        'Authorization': '563492ad6f91700001000001b3a4a11c21e44383a152d0008e3eb39e' // Free demo key
      }
    });

    const data = await response.json();

    if (data.videos && data.videos.length > 0) {
      // Get the direct MP4 link
      const videoFiles = data.videos[0].video_files;
      const selectedVideo = videoFiles.find((f: any) => f.quality === 'sd' || f.quality === 'hd') || videoFiles[0];
      
      return res.json({
        success: true,
        prompt: prompt,
        videoUrl: selectedVideo.link
      });
    }

    // Fallback if no specific video matches
    return res.json({
      success: false,
      message: 'No video found'
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to fetch video' });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
