const express = require('express');
const axios = require('axios');
const cors = require('cors');
const sharp = require('sharp');
const fs = require('fs');
const ytdl = require('ytdl-core');
const cp = require('child_process');
const ffmpeg = require('ffmpeg-static');
const ProgressBar = require('progress');
const app = express();
const PORT = process.env.PORT || 3000;
require('dotenv').config();
app.use(cors());

// Add a new route to fetch video content
app.get('/api/videos', async (req, res) => {
  try {
    console.log(req)
    const response = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
      params: {
        part: 'snippet,statistics',
        chart: 'mostPopular',
        regionCode: 'FR',
        maxResults: 50,
        key: process.env.YOUTUBE_API_KEY, // Remplacez par votre clé API
      },
    });
    res.json(response.data.items);
  } catch (error) {
    console.error('Error fetching videos from YouTube API:', error.message);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Data:', error.response.data);
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
      res.status(error.response.status).json({ error: error.response.data });
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Request:', error.request);
      res.status(500).json({ error: 'No response received from YouTube API' });
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error', error.message);
      res.status(500).json({ error: error.message });
    }
  }
});
app.get('/api/search', async (req, res) => {
  const query = req.query.query;
  if (!query) {
    return res.status(400).json({ error: 'Missing query parameter' });
  }

  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: query,
        maxResults: 50,
        key: process.env.YOUTUBE_API_KEY,
      },
    });
    res.json(response.data.items);
  } catch (error) {
    console.error('Error fetching search results from YouTube API:', error.message);
    res.status(500).json({ error: 'Failed to fetch search results' });
  }
});
// Add a new route to fetch thumbnail content
app.get('/api/thumbnail', async (req, res) => {
  const videoId = req.query.videoId;
  if (!videoId) {
    return res.status(400).json({ error: 'Missing videoId parameter' });
  }

  try {
    const response = await axios.get(`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`, {
      responseType: 'arraybuffer',
    });

    res.set('Content-Type', 'image/jpeg');
    res.send(response.data);
  } catch (error) {
    console.error('Error fetching or processing thumbnail from YouTube:', error.message);
    res.status(500).json({ error: 'Failed to fetch or process thumbnail' });
  }
});

// Add a new route to fetch avatar content
app.get('/api/avatar', async (req, res) => {
  const channelId = req.query.channelId;
  if (!channelId) {
    return res.status(400).json({ error: 'Missing channelId parameter' });
  }

  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/channels', {
      params: {
        part: 'snippet',
        id: channelId,
        key: process.env.YOUTUBE_API_KEY,
      },
    });
    const avatarUrl = response.data.items[0].snippet.thumbnails.high.url;
    const avatarResponse = await axios.get(avatarUrl, {
      responseType: 'arraybuffer',
    });

    res.set('Content-Type', 'image/jpeg');
    res.send(avatarResponse.data);
  } catch (error) {
    console.error('Error fetching or processing avatar from YouTube API:', error.message);
    res.status(500).json({ error: 'Failed to fetch or process avatar' });
  }
});
// Add a new route to stream video content
app.get('/api/video/', (req, res) => {
  const videoId = req.query.videoId;
  if (!videoId) {
    return res.status(400).json({ error: 'Missing videoId parameter' });
  }
  const url = `https://www.youtube.com/watch?v=${videoId}`;

  let video = ytdl(url, { filter: 'videoonly', quality: "highest"})
  let audio = ytdl(url, { filter: 'audioonly', highWaterMark: 1 << 25 });


  // create the ffmpeg process for muxing
  const ffmpegProcess = cp.spawn(
    ffmpeg,
    [
      '-loglevel', '0', '-hide_banner',
      // input audio by pipe
      "-i", "pipe:3",

      // input video by pipe
      "-i", "pipe:4",

      // map audio and video correspondingly
      "-map", "0:a",
      "-map", "1:v",

      // change the codec
      '-c:v', 'copy',
      '-c:a', 'flac',
      //   "-c:a", "aac",
      '-crf', '30',
      "-preset", "veryfast",

      // Allow output to be seekable, which is needed for mp4 output
      '-movflags', 'frag_keyframe+empty_moov',

      // Define output container
      '-f', 'mp4', 'pipe:5',
    ],
    {
      // no popup window for Windows users
      windowsHide: true,
      stdio: [
        // silence stdin/out, forward stderr,
        "inherit", "inherit", "inherit",
        // and pipe audio, video, output
        "pipe", "pipe", "pipe",
      ],
    }
  );
  
  audio.pipe(ffmpegProcess.stdio[3]);
  video.pipe(ffmpegProcess.stdio[4]);
  ffmpegProcess.stdio[5].pipe(res);
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
