import React, { useEffect, useRef, useState } from "react";

const App = () => {
  const wakeLockRef = useRef(null);
  const [count, setCount] = useState(0);
  const [activeTab, setActiveTab] = useState("wake"); // "wake" or "nonWake"

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

  const releaseWakeLock = async () => {
    if (wakeLockRef.current) {
      await wakeLockRef.current.release();
      wakeLockRef.current = null;
      console.log("Wake Lock manually released");
    }
  };

  // Request wake lock only when wake tab is active
  useEffect(() => {
    if (activeTab === "wake") {
      requestWakeLock();
    } else {
      releaseWakeLock();
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && activeTab === "wake") {
        requestWakeLock();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      releaseWakeLock();
    };
  }, [activeTab]);

  // Counter
  useEffect(() => {
    const timer = setInterval(() => {
      setCount((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="App">
      <h1>Wake Lock Demo</h1>

      {/* Tabs */}
      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() => setActiveTab("wake")}
          style={{ fontWeight: activeTab === "wake" ? "bold" : "normal" }}
        >
          Wake Lock Tab
        </button>
        <button
          onClick={() => setActiveTab("nonWake")}
          style={{ fontWeight: activeTab === "nonWake" ? "bold" : "normal" }}
        >
          Non-Wake Tab
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "wake" ? (
        <div>
          <p>Wake Lock is active on this tab.</p>
          <p>Counter: {count} {console.log("Wake Tab Render:", count)}</p>
        </div>
      ) : (
        <div>
          <p>This tab does NOT keep the screen awake.</p>
          <p>Counter: {count} {console.log("Non-Wake Tab Render:", count)}</p>
        </div>
      )}
    </div>
  );
};

export default App;
