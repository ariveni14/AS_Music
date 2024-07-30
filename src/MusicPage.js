import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const MusicPage = () => {
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    // Load songs - ensure these files exist in the public/music directory
    setSongs([
      { id: 1, title: "ninnele", src: "/music/song1.mp3", albumArt: "https://i.ytimg.com/vi/4DFBiapB-Cs/maxresdefault.jpg" },
      { id: 2, title: "priyamidhunam", src: "/music/song2.mp3", albumArt: "https://i.ytimg.com/vi/TkFz4sySV7M/maxresdefault.jpg" },
      { id: 3, title: "mehaboobha", src: "/music/song3.mp3", albumArt: "https://i.ytimg.com/vi/weLIci9JtAw/maxresdefault.jpg" },
    ]);
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      const updateCurrentTime = () => {
        setCurrentTime(audioRef.current.currentTime);
        setDuration(audioRef.current.duration);
      };

      audioRef.current.addEventListener('timeupdate', updateCurrentTime);

      
    }
  }, [currentSong]);

  const handleSongSelect = (song) => {
    setCurrentSong(song);
    if (audioRef.current) {
      audioRef.current.src = song.src;
      audioRef.current.play().catch((error) => console.error("Error playing audio:", error));
      setIsPlaying(true);
    }
  };

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play().catch((error) => console.error("Error playing audio:", error));
        setIsPlaying(true);
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleNext = () => {
    if (currentSong) {
      const currentIndex = songs.findIndex((song) => song.id === currentSong.id);
      const nextSong = songs[(currentIndex + 1) % songs.length];
      handleSongSelect(nextSong);
    }
  };

  const handlePrev = () => {
    if (currentSong) {
      const currentIndex = songs.findIndex((song) => song.id === currentSong.id);
      const prevSong = songs[(currentIndex - 1 + songs.length) % songs.length];
      handleSongSelect(prevSong);
    }
  };

  const handleProgressChange = (e) => {
    const newTime = (e.nativeEvent.offsetX / progressRef.current.clientWidth) * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  

  return (
    <div  className="bg-gradient-to-r from-blue-200 via-purple-300 to-pink-500 min-h-screen">
      {/* Header */}
      <header className="bg-base-100 shadow-md">
        <div className="container mx-auto flex justify-between items-center p-4">
          <h1 className="text-2xl font-bold ">Music Player</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4">
        {/* Music Library */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          <h2 className="text-xl font-bold mb-4 col-span-full text-white">Music Library</h2>
          {songs.map((song) => (
            <div
              key={song.id}
              className="bg-white shadow-lg rounded-lg p-4 cursor-pointer hover:shadow-xl transition-shadow"
              onClick={() => handleSongSelect(song)}
            >
              <img src={song.albumArt} alt={song.title} className="w-full h-48 object-cover rounded-lg mb-2" />
              <h3 className="text-lg font-semibold">{song.title}</h3>
            </div>
          ))}
        </div>

        {/* Player Controls */}
        <div className="flex flex-col items-center space-y-4 mt-4">
          <div className="flex flex-col items-center space-y-2">
            
            <div className="text-center mt-2 text-white">
              {currentSong ? `Playing: ${currentSong.title}` : "Select a song to play"}
            </div>
            <div className="w-full bg-gray-300 h-2 rounded-lg relative mt-4" ref={progressRef} onClick={handleProgressChange}>
              <div
                className="bg-blue-500 h-2 rounded-lg absolute top-0 left-0"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
            </div>
            <div className="flex justify-center items-center space-x-4 mt-2">
              <button className="btn btn-primary" onClick={handlePrev}>
                Prev
              </button>
              <motion.button
                className="btn btn-secondary"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
                onClick={handlePlayPause}
              >
                {isPlaying ? "Pause" : "Play"}
              </motion.button>
              <button className="btn btn-primary" onClick={handleNext}>
                Next
              </button>
            </div>
            <button className="btn btn-accent mt-2" onClick={toggleFullscreen}>
              Fullscreen
            </button>
          </div>
        </div>

        {/* Audio Element */}
        <audio ref={audioRef} controls hidden />
      </main>
    </div>
  );
};

export default MusicPage;
