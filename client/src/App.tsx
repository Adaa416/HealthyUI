import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate } from "react-router-dom";
import axios from 'axios';

interface Video {
  videoId: string;
  snippet: { title: string };
}

interface VideoDetails {
  videoId: string;
  snippet: {
    title: string;
  };
  relatedVideos: Video[];
}

const relatedVideosMap: { [key: string]: Video[] } = {
  '0PJeUvSlH0Y': [
    { videoId: 'KyoJYjOZiKU', snippet: { title: 'Video A1' } },
    { videoId: '2VuUrsD0098', snippet: { title: 'Video A2' } },
    { videoId: '0HQ3kndnVSQ', snippet: { title: 'Video A3' } },
  ],
  'Ho9em79_0qg': [
    { videoId: 'MLT5MKcbbr4', snippet: { title: 'Video B1' } },
    { videoId: 'rB6whhKrmxA', snippet: { title: 'Video B2' } },
    { videoId: 'sR0DLq2lMzU', snippet: { title: 'Video B3' } },
  ],
  'lSPTbJVxdjQ': [
    { videoId: 'c1', snippet: { title: 'Video C1' } },
    { videoId: 'c2', snippet: { title: 'Video C2' } },
    { videoId: 'c3', snippet: { title: 'Video C3' } },
  ],
  // ...add more mappings as needed
};

async function fetchVideoDetails(videoId: string): Promise<VideoDetails | null> {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=AIzaSyAjpGOlI45TjR_qYgNF6qjvagM6v1zdNi4`
    );

    if (response.data.items.length === 0) {
      console.error(`No video found for ID ${videoId}`);
      return null;
    }

    const relatedVideos = relatedVideosMap[videoId] || [];

    return {
      videoId: response.data.items[0].id,
      snippet: response.data.items[0].snippet,
      relatedVideos: relatedVideos,
    };
  } catch (error) {
    console.error(`Error fetching video with ID ${videoId}:`, error);
    return null;
  }
}


function Home({ videoDetails, setVideoDetails }: { videoDetails: VideoDetails[]; setVideoDetails: React.Dispatch<React.SetStateAction<VideoDetails[]>> }) {
  const videoIds = ['0PJeUvSlH0Y', 'Ho9em79_0qg', 'lSPTbJVxdjQ']; // Array of video IDs

  useEffect(() => {
    Promise.all(videoIds.map(fetchVideoDetails))
      .then(results => setVideoDetails(results.filter((video): video is VideoDetails => video !== null)))
      .catch(error => console.error(error));
  }, []);

  return (
    <div>
      <h1>Welcome to YouTube!</h1>
      <SearchBar setVideoDetails={setVideoDetails} />

      {videoDetails.map((video, index) => (
        <div key={index}>
          <h2>
            <Link to={`/video/${video.videoId}`}>
              {video.snippet.title}
            </Link>
          </h2>
          <div>
            <iframe
              width="560"
              height="315"
              src={`https://www.youtube.com/embed/${video.videoId}`}
              title={`YouTube video player ${index + 1}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      ))}
    </div>
  );
}

function SearchBar({ setVideoDetails }: { setVideoDetails: React.Dispatch<React.SetStateAction<VideoDetails[]>> }) {
  const [input, setInput] = React.useState("");

  const searchVideos = async () => {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${input}&key=AIzaSyAjpGOlI45TjR_qYgNF6qjvagM6v1zdNi4`
      );
      setVideoDetails(response.data.items.map((item: any) => ({
        videoId: item.id.videoId,
        snippet: item.snippet,
        relatedVideos: [], // replace this with actual related video data
      })));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <input type="text" value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={searchVideos}>Search</button>
    </div>
  );
}

function Video({ videoDetails, setVideoDetails }: { videoDetails: VideoDetails[]; setVideoDetails: React.Dispatch<React.SetStateAction<VideoDetails[]>> }) {
  const { videoId } = useParams<{ videoId?: string }>();
  const navigate = useNavigate();
  const videoDetail = videoDetails.find((video) => video.videoId === videoId);

  useEffect(() => {
    if (!videoId) {
      navigate('/');
      return;
    }

    if (!videoDetail) {
      fetchVideoDetails(videoId).then((newVideoDetail) => {
        if (newVideoDetail !== null) {
          setVideoDetails((prevDetails) => [...prevDetails, newVideoDetail]);
        }
      });
    }
  }, [videoId]);

  if (!videoDetail) {
    return <div>Loading...</div>;
  }

  const goHome = () => {
    navigate('/');
  };

  return (
    <div style={{ display: 'flex' }}>
      <div>
        <div style={{ position: 'fixed', top: '10px', left: '10px' }}>
          <button onClick={goHome}>Home Page</button>
        </div>
        <h1>{videoDetail.snippet.title}</h1>
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
      <VideoList videos={videoDetail.relatedVideos} />
    </div>
  );
}

function VideoList({ videos }: { videos: Video[] }) {
  return (
    <div>
      <h2>Related Videos</h2>
      {videos.map((video, index) => (
        <div key={index}>
          <Link to={`/video/${video.videoId}`}>{video.snippet.title}</Link>
        </div>
      ))}
    </div>
  );
}

function App() {
  const [videoDetails, setVideoDetails] = useState<VideoDetails[]>([]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home videoDetails={videoDetails} setVideoDetails={setVideoDetails} />} />
        <Route path="/video/:videoId" element={<Video videoDetails={videoDetails} setVideoDetails={setVideoDetails} />} />
      </Routes>
    </Router>
  );
}

export default App;
