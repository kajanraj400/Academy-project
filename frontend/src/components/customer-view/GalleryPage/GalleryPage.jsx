import React, { useState, useEffect, useCallback, useRef } from "react";
import "./GalleryPage.css"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight, faVolumeMute, faVolumeUp } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FilesDeleteConfirmation from "@/components/customer-view/GalleryPage/FilesDeleteConfirmation";
import { useLocation } from "react-router-dom";

const GalleryPage = () => {
  const [images, setImages] = useState([]); 
  const [videos, setVideos] = useState([]); 
  const [view, setView] = useState("images"); 
  const [error, setError] = useState(null);
  const [deletingItems, setDeletingItems] = useState([]); 
  const [isDeleting, setIsDeleting] = useState(false);
  const location = useLocation();
  const [muted, setMuted] = useState(true);
  const [currentPlayingVideo, setCurrentPlayingVideo] = useState(null);
  const videoRefs = useRef([]);

  // Fetch files from the server
  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/files", {credentials:"include"});
      if (!res.ok) throw new Error("Failed to fetch files");
      const data = await res.json();

      
      const imageFiles = data.filter((file) => file.fileType === "image");
      const videoFiles = data.filter((file) => file.fileType === "video");

      setImages(imageFiles);
      setVideos(videoFiles);
    } catch (err) {
      console.error("Error fetching files:", err);
      setError("Failed to load files.");
    }
  };
  
  const handleNext = useCallback(
    (type) => {
      if (isDeleting) return; 
      const slide = document.querySelector(`.${type}-slide`);
      const items = document.querySelectorAll(`.${type}-item`);
      if (slide && items.length > 0) {
        slide.appendChild(items[0]);
      }
    },
    [isDeleting] 
  );

  
  const handlePrev = useCallback(
    (type) => {
      if (isDeleting) return; 
      const slide = document.querySelector(`.${type}-slide`);
      const items = document.querySelectorAll(`.${type}-item`);
      if (slide && items.length > 0) {
        slide.prepend(items[items.length - 1]);
      }
    },
    [isDeleting] 
  );

  // Automatically change images every 15 secound (10,000 milliseconds)
  useEffect(() => {
    if (view === "images" && images.length > 1) {
      const interval = setInterval(() => {
        handleNext("image");
      }, 15000); // 60,000 milliseconds = 1 minute

      return () => clearInterval(interval); 
    }
  }, [view, images, handleNext]); 

  return (
    <div className="container" style={{
      width: "100vw",
      height: "100vh",
      background: "#f5f5f5",
      boxShadow: "0 30px 50px #dbdbdb",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    }}>
      
      <ToastContainer />

      {/* images,videos views buttons*/}
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <div className="view-buttons-container">
        <button
          className={`px-4 md:px-6 py-2 rounded-lg transition-colors duration-300 ${
            view === "images"
              ? "bg-teal-500 text-white hover:bg-teal-600"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          onClick={() => setView("images")}
          disabled={isDeleting} 
        >
          Images
        </button>
        <button
          className={`px-4 md:px-6 py-2 rounded-lg transition-colors duration-300 ${
            view === "videos"
              ? "bg-teal-500 text-white hover:bg-teal-600"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          onClick={() => setView("videos")}
          disabled={isDeleting} 
        >
          Videos
        </button>
      </div>

      {/* Image Slider */}
      {view === "images" && (
        <div className="image-slide slide">
          {images.map((file, index) => (
            <div
              key={file._id}
              className={`image-item item ${index === 0 ? "active" : ""} ${
                deletingItems.includes(file._id) ? "rocket-animation" : ""
              }`}
              style={{
                backgroundImage: `url(${file.fileUrl})`, 
              }}
            >
              
              <div className="content">
                <button className="cursor-default">ProShots Creations</button>
                { location.pathname.includes('/admin/gallery') &&
                  <FilesDeleteConfirmation
                    fileId={file._id}
                    fileType="image"
                    setDeletingItems={setDeletingItems}
                    setImages={setImages}
                    setVideos={setVideos}
                    setIsDeleting={setIsDeleting}
                    isDeleting={isDeleting}
                  />
              }
              </div>
              
            </div>
          ))}
        </div>
      )}

      {/* Navigation Arrow buttons for Image Slider */}
      {view === "images" && (
        <div className="buttons">
          <button
            className="prev"
            onClick={() => handlePrev("image")}
            disabled={isDeleting}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <button
            className="next"
            onClick={() => handleNext("image")}
            disabled={isDeleting}
          >
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
      )}

      {/* Video Slider */}
      {view === "videos" && (
        <div className="video-slide slide">
          {videos.map((file, index) => (
            <div
              key={file._id}
              className={`video-item item ${index === 0 ? "active" : ""} ${
                deletingItems.includes(file._id) ? "rocket-animation" : ""
              }`}
              style={{
                backgroundImage: `url(${file.fileUrl})`,
              }}
            >
              <video 
                className="video-player" 
                autoPlay 
                loop 
                playsInline 
                muted={muted}
              >
                <source src={file.fileUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>              
              
              <div className="content">
                <button className="cursor-default">ProShots Creations</button>
                { location.pathname.includes('/admin/gallery') &&
                <FilesDeleteConfirmation
                  fileId={file._id}
                  fileType="video"
                  setDeletingItems={setDeletingItems}
                  setImages={setImages}
                  setVideos={setVideos}
                  setIsDeleting={setIsDeleting}
                  isDeleting={isDeleting}
                />
                }
              </div>
            </div>
          ))}

            <button
                className="mute-button"
                onClick={() => setMuted((prevMuted) => !prevMuted)}
                disabled={isDeleting}
                style={{
                position: "absolute",
                bottom: "20px",
                right: "20px",
                backgroundColor: "#fff",
                borderRadius: "50%",
                padding: "10px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                }}
            >
                <FontAwesomeIcon icon={muted ? faVolumeMute : faVolumeUp} />
            </button>

        </div>
      )}

      {/* Navigation Arrow buttons for Video Slider */}
      {view === "videos" && (
        <div className="buttons">
          <button
            className="prev"
            onClick={() => handlePrev("video")}
            disabled={isDeleting}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <button
            className="next"
            onClick={() => handleNext("video")}
            disabled={isDeleting}
          >
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
