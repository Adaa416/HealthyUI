import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import SearchBox from './Search box L.png';
import Search from './Search1.png';
import MoreInfo from './MoreInfo.png';



interface Thumbnail {
  url: string;
  width: number;
  height: number;
}

interface Thumbnails {
  default: Thumbnail;
  medium: Thumbnail;
  high: Thumbnail;
}

interface Video {
  videoId: string;
  snippet: { title: string };
}


interface VideoDetails {
  videoId: string;
  snippet: {
    title: string;
    thumbnails: Thumbnails;
  };
  relatedVideos: Video[];
  similarVideos: Video[];
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

const similarVideosMap: { [key: string]: Video[] } = {
  '0PJeUvSlH0Y': [
    { videoId: 'XbwYkFcPmog', snippet: { title: 'Similar Video A1' } },
    { videoId: 'prMM6ki70OE', snippet: { title: 'Similar Video A2' } },
    { videoId: 'uigtClFQDm0', snippet: { title: 'Similar Video A3' } },
  ],
  'Ho9em79_0qg': [
    { videoId: 'RL35w30H6Hc', snippet: { title: 'Video B1' } },
    { videoId: 'fZlvvMJJ2Sw', snippet: { title: 'Video B2' } },
    { videoId: 'ES7GLGfXwBE', snippet: { title: 'Video B3' } },
  ],
  'lSPTbJVxdjQ': [
    { videoId: 'c1', snippet: { title: 'Video C1' } },
    { videoId: 'c2', snippet: { title: 'Video C2' } },
    { videoId: 'c3', snippet: { title: 'Video C3' } },
  ],
  // ...add more mappings as needed
};


async function fetchRelatedVideoDetails(video: Video): Promise<Video | null> {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${video.videoId}&key=AIzaSyAjpGOlI45TjR_qYgNF6qjvagM6v1zdNi4`
    );

    if (response.data.items.length === 0) {
      console.error(`No video found for ID ${video.videoId}`);
      return null;
    }

    // Return the fetched video details
    return {
      videoId: response.data.items[0].id,
      snippet: response.data.items[0].snippet,
    };
  } catch (error) {
    console.error(`Error fetching video with ID ${video.videoId}:`, error);
    return null;
  }
}


async function fetchVideoDetails(videoId: string): Promise<VideoDetails | null> {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=AIzaSyAjpGOlI45TjR_qYgNF6qjvagM6v1zdNi4`
    );

    if (response.data.items.length === 0) {
      console.error(`No video found for ID ${videoId}`);
      return null;
    }

    // Fetch details for related and similar videos
    const relatedVideosPromise = Promise.all((relatedVideosMap[videoId] || []).map(fetchRelatedVideoDetails));
    const similarVideosPromise = Promise.all((similarVideosMap[videoId] || []).map(fetchRelatedVideoDetails));

    const relatedVideos = (await relatedVideosPromise).filter((video): video is Video => video !== null);
    const similarVideos = (await similarVideosPromise).filter((video): video is Video => video !== null);

    return {
      videoId: response.data.items[0].id,
      snippet: response.data.items[0].snippet,
      relatedVideos,
      similarVideos,
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
      
      <SearchBar setVideoDetails={setVideoDetails} />

      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        {videoDetails.map((video, index) => (
          <div key={index} style={{ flexBasis: '32%', marginBottom: '20px' }}>
            <h2 style={{ wordWrap: 'break-word', marginBottom: '10px' }}>
              <Link to={`/video/${video.videoId}`}>
                {video.snippet.title}
              </Link>
            </h2>
            <div>
              <iframe
                width="100%"
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
    </div>
  );
}




function SearchBar({ setVideoDetails }: { setVideoDetails: React.Dispatch<React.SetStateAction<VideoDetails[]>> }) {
  const [input, setInput] = React.useState("");

  const searchVideos = async (keyword = input) => {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${keyword}&key=AIzaSyAjpGOlI45TjR_qYgNF6qjvagM6v1zdNi4`
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

  // Example keyword list
  const keywords = ["Lost Weight", "Diet Plan", "Extreme Sports"];

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '30vh',
        flexWrap: 'nowrap' // added this line
      }}>
        <input 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          style={{
            backgroundImage: `url(${SearchBox})`, 
            backgroundSize: 'cover', // or use 'cover', or specify a length or a percentage
            backgroundRepeat: 'no-repeat',
            color: 'black', // assuming the image is dark
            border: 'none',
            height: '30%',
            width: '30%',
            padding: '0.2%',
            fontSize: '30px',
            flexShrink: 0 // added this line
          }} 
        />
        <button 
          onClick={() => searchVideos()}
          style={{
            backgroundImage: `url(${Search})`, 
            backgroundSize: 'cover', // or use 'cover', or specify a length or a percentage
            backgroundRepeat: 'no-repeat',
            border: 'none',
            height: '32.5%',
            width: '6.5%',
            flexShrink: 0 // added this line
          }} 
        />
      </div>

      <div style={{
        display: 'flex', 
        justifyContent: 'center',
        flexWrap: 'wrap',
        marginTop: '0.1%',
        marginBottom: '4%'
      }}>
        {keywords.map((keyword) => (
          <button 
            onClick={() => searchVideos(keyword)} 
            style={{
              margin: '0 1%',
              padding: '1% 1%', // padding to increase button size
              fontSize: '100%', // font size increase for better visibility
              borderRadius: '20px', // optional: rounds the corners of the button
            }}
          >
            {keyword}
          </button>
        ))}
      </div>
    </div>
  );
}













function Video({ videoDetails, setVideoDetails }: { videoDetails: VideoDetails[]; setVideoDetails: React.Dispatch<React.SetStateAction<VideoDetails[]>> }) {
  const { videoId } = useParams<{ videoId?: string }>();
  const navigate = useNavigate();
  const videoDetail = videoDetails.find((video) => video.videoId === videoId);
  const [showInfo, setShowInfo] = useState(false); // The state to manage the visibility of the related and similar videos

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
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}> {/* added this div */}
          <h1 style={{ maxWidth: '560px' }}>
            {videoDetail.snippet.title}
          </h1>
          <iframe
            width="560"
            height="315"
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
          {/* More Information button */}
          <button 
            style={{
              backgroundImage: `url(${MoreInfo})`, 
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              border: 'none',
              height: '33px', 
              width: '30px', 
              marginTop: '3%'  // space above the button
            }}
            onClick={() => setShowInfo(!showInfo)}
          />
        </div>
      </div>
      {/* Display related and similar videos when showInfo is true */}
      {showInfo && (
        <div style={{ marginLeft: '20px', width: '800px' }}>
          <VideoList title="Video Contains Opposite Opinion..." videos={videoDetail.relatedVideos} />
          <VideoList title="Similar Video With Moderation..." videos={videoDetail.similarVideos} />
        </div>
      )}
    </div>
  );
  
  
}  



function VideoList({ title, videos }: { title: string, videos: Video[] }) {
  return (
    <div>
      <h2>{title}</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
        {videos.map((video, index) => (
          <div key={index} style={{ flex: '1 0 30%', maxWidth: '30%', margin: '1%', boxSizing: 'border-box' }}>
            <Link to={`/video/${video.videoId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ 
                  fontSize: '16px',
                  lineHeight: '20px',
                  height: '60px', /* height is 2x line-height, so it will display 2 lines */
                  overflow: 'hidden', 
              }}>
                {video.snippet.title}
              </div>
            </Link>
            <div>
              <iframe
                width="100%"
                height="auto"
                src={`https://www.youtube.com/embed/${video.videoId}`}
                title={`YouTube video ${index + 1}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        ))}
      </div>
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
