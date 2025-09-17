import React from "react";

function ResponsiveIframe() {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        paddingTop: "56.25%", // 16:9 aspect ratio, change if needed
        overflow: "hidden",
      }}
    >
      <iframe
        src="https://exuberant-marketing-937720.framer.app/"
        title="Framer Design"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          border: "none",
        }}
        allowFullScreen
      ></iframe>
    </div>
  );
}

export default ResponsiveIframe;


