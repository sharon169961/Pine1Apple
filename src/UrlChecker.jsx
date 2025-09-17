import React, { useState } from "react";

function UrlChecker() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);

  const checkUrl = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url })
      });
      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setResult({ status: "error", confidence: 0 });
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter URL to check"
        className="border p-2 rounded w-80"
      />
      <button
        onClick={checkUrl}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Check
      </button>

      {result && (
        <div className="mt-4 text-center">
          <p>Status: {result.status}</p>
          <p>Confidence: {result.confidence}%</p>
        </div>
      )}
    </div>
  );
}

export default UrlChecker;
