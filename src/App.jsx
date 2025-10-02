import React, { useEffect, useRef, useState } from "react";

const App = () => {
  const wakeLockRef = useRef(null);
  const [count, setCount] = useState(0);

  // Auto wake lock
  const requestWakeLock = async () => {
    try {
      if ("wakeLock" in navigator) {
        wakeLockRef.current = await navigator.wakeLock.request("screen");
        console.log("Wake Lock active");
        wakeLockRef.current.addEventListener("release", () => {
          console.log("Wake Lock released");
        });
      }
    } catch (err) {
      console.error("Wake Lock failed:", err);
    }
  };

  useEffect(() => {
    requestWakeLock();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") requestWakeLock();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (wakeLockRef.current) wakeLockRef.current.release();
    };
  }, []);

  // Example: update count every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCount((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="App">
      <h1>Hello Vite + React!</h1>
      <p>Screen wake lock is active automatically.</p>
      <p>Counter: {count} {console.log("Render count:", count)}</p>
      <p>{console.log("Component rendered at", new Date().toLocaleTimeString())}</p>
    </div>
  );
};

export default App;
