import React, { useEffect, useRef, useState } from "react";
import pollutionImg from "../assets/pollution.png";

export default function ARView() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [pollutionLevel, setPollutionLevel] = useState(0);
  const [error, setError] = useState("");

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
      streamRef.current = stream;
      setCameraOn(true);
      setError("");
    } catch (err) {
      console.error("Camera start failed:", err);
      setError("Camera access denied or unavailable.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
    if (videoRef.current) videoRef.current.srcObject = null;
    streamRef.current = null;
    setCameraOn(false);
    setPollutionLevel(0);
    setError("");
  };

  const toggleCamera = () => {
    if (cameraOn) stopCamera();
    else startCamera();
  };

  useEffect(() => {
    if (!cameraOn) return;

    const fetchPollution = () => {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const response = await fetch("http://127.0.0.1:8000/track-location", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude
              }),
            });
            const data = await response.json();
            const level = data.pollution_level ?? Math.min(data.carbon_footprint * 20, 100);
            setPollutionLevel(level);
          } catch (err) {
            console.error("Pollution fetch failed:", err);
            setError("Failed to load pollution data.");
          }
        },
        (err) => {
          console.error("Geo error:", err);
          setError("Location permission denied.");
        }
      );
    };

    fetchPollution();
    const interval = setInterval(fetchPollution, 10000);
    return () => clearInterval(interval);
  }, [cameraOn]);

  return (
    <div style={{
      position: "relative",
      width: "100vw",
      height: "100vh",
      backgroundColor: "#000",
      overflow: "hidden",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      userSelect: "none",
    }}>
      {/* Toggle Button */}
      <button
        onClick={toggleCamera}
        style={{
          position: "absolute",
          top: "5%",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000,
          padding: "1rem 2rem",
          backgroundColor: cameraOn ? "#ff3b3b" : "#2ecc71",
          color: "#fff",
          border: "none",
          borderRadius: "2rem",
          cursor: "pointer",
          fontSize: "1.1rem",
          fontWeight: "bold",
          boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
          transition: "background-color 0.3s ease",
        }}
      >
        {cameraOn ? "Turn Camera OFF" : "Turn Camera ON"}
      </button>

      {/* Video Stream */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: cameraOn ? "block" : "none",
          zIndex: 1,
        }}
      />

      {/* Pollution Overlay */}
      {cameraOn && (
        <>
          <img
            src={pollutionImg}
            alt="Pollution Overlay"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              opacity: pollutionLevel / 100,
              pointerEvents: "none",
              transition: "opacity 1s ease-in-out",
              mixBlendMode: "screen",
              zIndex: 2,
            }}
          />

          {/* Pollution Level Text */}
          <div style={{
            position: "absolute",
            top: "15%",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(0, 0, 0, 0.7)",
            color: "#00ffc8",
            padding: "1rem 2rem",
            fontSize: "1.3rem",
            fontWeight: "700",
            borderRadius: "1rem",
            textAlign: "center",
            zIndex: 3,
            backdropFilter: "blur(6px)",
            boxShadow: "0 0 15px rgba(0,255,200,0.3)",
            userSelect: "none",
          }}>
            {error ? error : `🌫️ Pollution Level: ${Math.round(pollutionLevel)}%`}
          </div>
        </>
      )}

      {/* Camera Off Placeholder */}
      {!cameraOn && !error && (
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          color: "#ccc",
          fontSize: "1.3rem",
          padding: "1rem",
          textAlign: "center",
          background: "rgba(0,0,0,0.4)",
          borderRadius: "1rem",
          zIndex: 1,
          userSelect: "none",
          maxWidth: "90vw",
          lineHeight: "1.5",
        }}>
          Camera is <strong>OFF</strong><br />
          Tap the button above to enable AR pollution view.
        </div>
      )}

      {/* Show error if exists and camera is on */}
      {cameraOn && error && (
        <div style={{
          position: "absolute",
          bottom: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          background: "rgba(255, 0, 0, 0.8)",
          color: "white",
          padding: "0.8rem 1.5rem",
          borderRadius: "1rem",
          fontWeight: "bold",
          zIndex: 4,
          userSelect: "none",
          maxWidth: "90vw",
          textAlign: "center"
        }}>
          {error}
        </div>
      )}
    </div>
  );
}
