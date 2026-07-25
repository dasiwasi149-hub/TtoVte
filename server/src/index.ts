import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// 1. Serve the visual web interface
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
        textarea { width: 100%; height: 100px; padding: 10px; border-radius: 8px; border: 1px solid #334155; background: #1e293b; color: #fff; box-sizing: border-box; }
        button { background: #0284c7; color: white; border: none; padding: 12px 20px; border-radius: 8px; cursor: pointer; font-weight: bold; margin-top: 10px; width: 100%; }
        button:hover { background: #0369a1; }
        #output { margin-top: 20px; padding: 15px; background: #1e293b; border-radius: 8px; display: none; word-break: break-all; }
      </style>
    </head>
    <body>
      <h1>Text to Video Studio</h1>
      <p>Enter your script or prompt below:</p>
      <textarea id="prompt" placeholder="Type your video idea here..."></textarea>
      <button onclick="generateVideo()">Generate Video</button>
      <div id="output"></div>

      <script>
        async function generateVideo() {
          const prompt = document.getElementById('prompt').value;
          const output = document.getElementById('output');
          if (!prompt) return alert('Please enter a prompt first!');
          
          output.style.display = 'block';
          output.innerText = 'Processing your request... Please wait.';

          try {
            const res = await fetch('/api/generate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ prompt })
            });
            const data = await res.json();
            output.innerText = data.message;
          } catch (err) {
            output.innerText = 'Error processing your request.';
          }
        }
      </script>
    </body>
    </html>
  `);
});

// 2. Handle the video generation API call
app.post('/api/generate', (req, res) => {
  const { prompt } = req.body;
  res.json({ message: `Success! Received prompt: "${prompt}". Video generation queued.` });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
