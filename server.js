import express from 'express';
import path from 'path';

const app = express();
const __dirname = path.resolve();

// Serve all static files from root folder
app.use(express.static(__dirname));

// Ping endpoint for uptime monitoring
app.get('/ping', (req, res) => {
  res.send('pong');
});

// Optional: SPA fallback for frontend routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
