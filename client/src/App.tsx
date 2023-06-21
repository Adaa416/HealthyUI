import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useParams } from 'react-router-dom';

function Home() {
  // Specify the videoId directly in this component
  const videoId = '0PJeUvSlH0Y';

  return (
    <div>
      <h1>Welcome to YouTube!</h1>
      <h2>Video 1</h2>
      <iframe
        width="560"
        height="315"
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
      {/* Add more links or video players as needed */}
    </div>
  );
}


function VideoPlayer() {
  const { videoId } = useParams();

  return (
    <div>
      <h1>Now playing: {videoId}</h1>
      <iframe
        width="560"
        height="315"
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/video/:videoId" element={<VideoPlayer />} />
      </Routes>
    </Router>
  );
}

export default App;
