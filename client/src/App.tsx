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
  'py5OohZ8AgY': [
    { videoId: 'eXTiiz99p9o', snippet: { title: 'Video A1' } },
    { videoId: 'xwTGZ27LNFQ', snippet: { title: 'Video A2' } },
    { videoId: '9YNF3_SImno', snippet: { title: 'Video A3' } },
  ],
  'MKd38G338Qw': [
    { videoId: 'izKLnQgVj54', snippet: { title: 'Video B1' } },
    { videoId: 'KW-a6Aec8eE', snippet: { title: 'Video B2' } },
    { videoId: '8EYQ3Txm7Yc', snippet: { title: 'Video B3' } },
  ],
  'k_smK3zXInE': [
    { videoId: 'se9iQwLCGxw', snippet: { title: 'Video C1' } },
    { videoId: 'q6QkN5Mz2xk', snippet: { title: 'Video C2' } },
    { videoId: 'bdBorupFLzk', snippet: { title: 'Video C3' } },
  ],
  'RZMKC6KWUC8': [
    { videoId: 'fcgczCIg5i8', snippet: { title: 'Video C1' } },
    { videoId: 'le6-pGafpw0', snippet: { title: 'Video C2' } },
    { videoId: '8lCPwYaE2gA', snippet: { title: 'Video C3' } },
  ],
  'c7FMfQJw6Jk': [
    { videoId: 'AeZhyo2c0wY', snippet: { title: 'Video C1' } },
    { videoId: 'sx81vcCliFA', snippet: { title: 'Video C2' } },
    { videoId: '0adeZP6aDQw', snippet: { title: 'Video C3' } },
  ],
  'O0yxJH2i0DE': [
    { videoId: 'bKVsdIkt-FU', snippet: { title: 'Video C1' } },
    { videoId: 'pU3_S9YgRBc', snippet: { title: 'Video C2' } },
    { videoId: 'bp6FbmyJ_kc', snippet: { title: 'Video C3' } },
  ],
  'vr3CQEjSPdc': [
    { videoId: 'cP1HhbdBG_c', snippet: { title: 'Video C1' } },
    { videoId: '4xFaYS-k8r8', snippet: { title: 'Video C2' } },
    { videoId: 'ikd5aXpciUg', snippet: { title: 'Video C3' } },
  ],
  'sx81vcCliFA': [
    { videoId: 'AGWnpwjSCy0', snippet: { title: 'Video C1' } },
    { videoId: 'bgp7cFApZSI', snippet: { title: 'Video C2' } },
    { videoId: 'm60146AeQ_g', snippet: { title: 'Video C3' } },
  ],
  
  // ...add more mappings as needed
};

const similarVideosMap: { [key: string]: Video[] } = {
  'py5OohZ8AgY': [
    { videoId: 'orh1W0sxCQI', snippet: { title: 'Similar Video A1' } },
    { videoId: 'hNtHHFQY1Xo&t=1s', snippet: { title: 'Similar Video A2' } },
    { videoId: 'vr3CQEjSPdc', snippet: { title: 'Similar Video A3' } },
  ],
  'MKd38G338Qw': [
    { videoId: 'rUuAeto5Qe4', snippet: { title: 'Video B1' } },
    { videoId: 'q42n27oCOUM', snippet: { title: 'Video B2' } },
    { videoId: 'DLYb3IgQ1Qk', snippet: { title: 'Video B3' } },
  ],
  'k_smK3zXInE': [
    { videoId: 'BCQZ7PT8GSQ', snippet: { title: 'Video C1' } },
    { videoId: 'sfswUsyqF7U', snippet: { title: 'Video C2' } },
    { videoId: 'J4l_mLmvHnk', snippet: { title: 'Video C3' } },
  ],
  'RZMKC6KWUC8': [
    { videoId: 'E-ZTAo2m2Fo', snippet: { title: 'Video C1' } },
    { videoId: 'oH0J0Im0uFk', snippet: { title: 'Video C2' } },
    { videoId: 'TmR9Dw2NBEY', snippet: { title: 'Video C3' } },
  ],
  'c7FMfQJw6Jk': [
    { videoId: 'HMxlJm8lTLo', snippet: { title: 'Video C1' } },
    { videoId: 'pSNpO8tNMz0', snippet: { title: 'Video C2' } },
    { videoId: 'ZTlMZiJoT8g', snippet: { title: 'Video C3' } },
  ],
  'O0yxJH2i0DE': [
    { videoId: 'AeZhyo2c0wY', snippet: { title: 'Video C1' } },
    { videoId: 'teE-xVO-ljw', snippet: { title: 'Video C2' } },
    { videoId: 'iDbdXTMnOmE', snippet: { title: 'Video C3' } },
  ],
  'vr3CQEjSPdc': [
    { videoId: 'DeXntM0gCEA', snippet: { title: 'Video C1' } },
    { videoId: '3feSPKetkmI', snippet: { title: 'Video C2' } },
    { videoId: 'bkCK_Bl_fBc', snippet: { title: 'Video C3' } },
  ],
  'sx81vcCliFA': [
    { videoId: 'QQYgCxu988s', snippet: { title: 'Video C1' } },
    { videoId: 'cyqYN90PPjE', snippet: { title: 'Video C2' } },
    { videoId: 'JWTVtYEeJic', snippet: { title: 'Video C3' } },
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
  const videoIds = ['py5OohZ8AgY', 'MKd38G338Qw', 'k_smK3zXInE', 'RZMKC6KWUC8', 'c7FMfQJw6Jk', 'O0yxJH2i0DE']; // Array of video IDs

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
            <h2 style={{ wordWrap: 'break-word', marginTop: '10px' }}>
              <Link to={`/video/${video.videoId}`}>
                {video.snippet.title}
              </Link>
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
}





function SearchBar({ setVideoDetails }: { setVideoDetails: React.Dispatch<React.SetStateAction<VideoDetails[]>> }) {
  const [input, setInput] = React.useState("");
  const [hoveredButton, setHoveredButton] = React.useState<string | null>(null);

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
  const keywords = ["Weight Loss", "Work-Life Balance", "Plastic Surgery", "Body Modification", "Environmentalism", "Technology Usage"];

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '30vh',
        flexWrap: 'nowrap'
      }}>
        <input 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          style={{
            backgroundImage: `url(${SearchBox})`, 
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            color: 'black',
            border: 'none',
            height: '30%',
            width: '30%',
            padding: '0.2%',
            fontSize: '30px',
            flexShrink: 0 
          }} 
        />
        <button 
          onClick={() => searchVideos()}
          style={{
            backgroundImage: `url(${Search})`, 
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            border: 'none',
            height: '32.5%',
            width: '6.5%',
            flexShrink: 0
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
            onMouseEnter={() => setHoveredButton(keyword)}
            onMouseLeave={() => setHoveredButton(null)}
            onClick={() => searchVideos(keyword)} 
            style={{
              margin: '0 1%',
              padding: '1% 1%',
              fontSize: '100%',
              borderRadius: '20px',
              backgroundColor: hoveredButton === keyword ? 'darkgray' : 'lightgrey'
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
  const [hoveredMoreInfoButton, setHoveredMoreInfoButton] = useState(false);
  const [hoveredShareButton, setHoveredShareButton] = useState(false);
  const [hoveredDownloadButton, setHoveredDownloadButton] = useState(false);

  // Reset showInfo when videoId changes
  useEffect(() => {
    setShowInfo(false);
  }, [videoId]);

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
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
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
          <div style={{display: 'flex', flexDirection: 'row'}}>
            {/* Share button */}
            <button 
              onMouseEnter={() => setHoveredShareButton(true)}
              onMouseLeave={() => setHoveredShareButton(false)}
              style={{
                backgroundColor: hoveredShareButton ? 'darkgrey' : 'lightgrey', 
                border: 'none',
                borderRadius: '15px',
                height: '33px', 
                width: '100px',
                marginRight: '10px',
                marginTop: '3%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              onClick={() => {}} // Add functionality here
            >
              <span style={{fontSize: '16px'}}>Share</span>
            </button>
            {/* Download button */}
            <button 
              onMouseEnter={() => setHoveredDownloadButton(true)}
              onMouseLeave={() => setHoveredDownloadButton(false)}
              style={{
                backgroundColor: hoveredDownloadButton ? 'darkgrey' : 'lightgrey', 
                border: 'none',
                borderRadius: '15px',
                height: '33px', 
                width: '100px',
                marginRight: '10px',
                marginTop: '3%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              onClick={() => {}} // Add functionality here
            >
              <span style={{fontSize: '16px'}}>Download</span>
            </button>
            {/* More Information button */}
            <button 
              onMouseEnter={() => setHoveredMoreInfoButton(true)}
              onMouseLeave={() => setHoveredMoreInfoButton(false)}
              style={{
                backgroundColor: hoveredMoreInfoButton ? 'darkgrey' : 'lightgrey', 
                border: 'none',
                borderRadius: '15px',
                height: '33px', 
                width: '100px',
                marginTop: '3%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              onClick={() => setShowInfo(!showInfo)}
            >
              <span style={{fontSize: '16px', fontWeight: 'bold'}}>MoreInfo ▶ </span>
            </button>
          </div>
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
              <div style={{ 
                  fontSize: '16px',
                  lineHeight: '20px',
                  height: '60px', /* height is 2x line-height, so it will display 2 lines */
                  overflow: 'hidden', 
              }}>
                {video.snippet.title}
              </div>
            </Link>
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
