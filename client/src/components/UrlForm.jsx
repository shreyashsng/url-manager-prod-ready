import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UrlForm = () => {
  const [original, setOriginal] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/urls`,
        { original },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShortUrl(`${window.location.origin}/${res.data.shortCode}`);
    } catch (error) {
        if(error.response && error.response.status === 429){
            alert("Too many requests, please try again later.")
        }
      console.error(error);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          className="border p-2 flex-1 rounded focus:ring-2 focus:ring-blue-200 focus:outline-none transition duration-200"
          placeholder="Enter your URL"
          value={original}
          onChange={(e) => setOriginal(e.target.value)}
        />
        <button className="bg-blue-600 hover:bg-blue-700 transition duration-200 text-white px-4 py-2 rounded cursor-pointer">
          Shorten
        </button>
      </form>

      {shortUrl && (
        <div className="mt-4 p-4 bg-gray-100 rounded animate-fadeIn">
          <p className="font-semibold text-gray-800 mb-2">Your short URL: </p>
          <div className="flex items-center gap-2">
            <a
              href={shortUrl}
              target="_blank"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              {shortUrl}
            </a>
            <button type="button" onClick={() => {
                navigator.clipboard.writeText(shortUrl);
                alert("Copied to Clipboard!");
            }} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm">Copy</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UrlForm;
