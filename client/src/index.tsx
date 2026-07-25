import React from 'react';
import ReactDOM from 'react-dom/client';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Text-to-Video Studio</h1>
      <p>Frontend successfully deployed!</p>
    </div>
  </React.StrictMode>
);
