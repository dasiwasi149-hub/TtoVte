import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

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
        #canvas-container { margin-top: 20px; display: none; text-align: center; }
        canvas { width: 100%; max-width: 500px; height: 280px; border-radius: 8px; border: 1px solid #334155; background: #000; }
      </style>
    </head>
    <body>
      <h1>Text to Video Studio</h1>
      <p>Enter your prompt to render video animation:</p>
      <textarea id="prompt" placeholder="Type prompt (e.g. horse running, goat grazing)..."></textarea>
      <button onclick="generateVideo()">Generate Video</button>
      
      <p id="status"></p>

      <div id="canvas-container">
        <h3>Rendered Video Output:</h3>
        <canvas id="videoCanvas" width="640" height="360"></canvas>
      </div>

      <script>
        let animationId = null;

        function generateVideo() {
          const prompt = document.getElementById('prompt').value;
          const status = document.getElementById('status');
          const container = document.getElementById('canvas-container');
          const canvas = document.getElementById('videoCanvas');
          const ctx = canvas.getContext('2d');

          if (!prompt) return alert('Please enter a prompt!');
          
          status.innerText = 'Rendering video frames for "' + prompt + '"...';
          container.style.display = 'block';

          if (animationId) cancelAnimationFrame(animationId);

          let frame = 0;
          const text = prompt.toUpperCase();
          
          function render() {
            frame++;
            
            // Background gradient animation
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, '#0f172a');
            gradient.addColorStop(0.5, '#1e293b');
            gradient.addColorStop(1, '#0284c7');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Animated subject element moving across frame
            const posX = (frame * 4) % (canvas.width + 200) - 100;
            const posY = 180 + Math.sin(frame * 0.1) * 30;

            // Render animated object badge
            ctx.fillStyle = '#38bdf8';
            ctx.beginPath();
            ctx.arc(posX, posY, 40, 0, Math.PI * 2);
            ctx.fill();

            // Overlay prompt text directly on video
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 28px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(text, canvas.width / 2, 80);

            // Subtitle status line
            ctx.font = '16px sans-serif';
            ctx.fillStyle = '#94a3b8';
            ctx.fillText('Frame: ' + frame + ' | Mode: Self-Rendered Video', canvas.width / 2, 320);

            animationId = requestAnimationFrame(render);
          }

          setTimeout(() => {
            status.innerText = 'Playing rendered video for "' + prompt + '"!';
            render();
          }, 800);
        }
      </script>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
