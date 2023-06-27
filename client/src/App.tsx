import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from "react-router-dom";
import axios from 'axios';


interface Video {
  id: { videoId: string };
  snippet: { title: string };
}

// Define videoIds array outside the component
const videoIds = ['0PJeUvSlH0Y', '0cXRLBx-N9g', 'tX3w7LvYrtY'];

function Home() {
  const [videos, setVideos] = useState<Array<any>>([]);
  const API_KEY = 'AIzaSyAjpGOlI45TjR_qYgNF6qjvagM6v1zdNi4'; 

  useEffect(() => {
    // Map over the videoIds to create an array of promises
    const fetchVideoDetails = videoIds.map(videoId => {
      return axios.get(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${API_KEY}`)
    });

    // Use Promise.all to wait for all promises to resolve
    Promise.all(fetchVideoDetails)
      .then(response => {
        // Use map to extract the needed details from each video and return a new array
        const videoDetails = response.map(res => res.data.items[0]);
        setVideos(videoDetails);
      })
      .catch(error => console.error('Error fetching video details:', error));
  }, []); // <-- the dependencies array is now empty

  return (
    <div>
      <SearchBar />
      <h1>Mock YouTube Interface</h1>
      {videos.map(video => (
        <div key={video.id}>
          <h2>{video.snippet.title}</h2>
          <iframe
            width="560"
            height="315"
            src={`https://www.youtube.com/embed/${video.id}`}
            title={video.snippet.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ))}
    </div>
  );
}


function VideoPlayer() {
  const { videoId } = useParams();  // Getting video ID from the URL

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



function SearchBar() {
  const [input, setInput] = React.useState("");
  const [videos, setVideos] = React.useState<Video[]>([]);

  const searchVideos = async () => {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${input}&key=AIzaSyAjpGOlI45TjR_qYgNF6qjvagM6v1zdNi4`
      );
      setVideos(response.data.items);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <input value={input} onChange={e => setInput(e.target.value)} />
      <button onClick={searchVideos}>Search</button>

      {videos.map((video, index) => (
        <div key={index}>
          <h2>{video.snippet.title}</h2>
          <iframe
            width="560"
            height="315"
            src={`https://www.youtube.com/embed/${video.id.videoId}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      ))}
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/video/:videoId" element={<VideoPlayer />} />
        <Route path="/search" element={<SearchBar />} />
      </Routes>
    </Router>
  );
}

export default App;
