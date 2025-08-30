import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function UploadForm() {
  const [file, setFile] = useState(null);
  const [length, setLength] = useState("short");
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("summaries");
    if (saved) setHistory(JSON.parse(saved));

    setFile(null);
    setLength("short");
    setSummary(null);
    setError(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem("summaries", JSON.stringify(history));
    }
  }, [history]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("length", length);

    try {
      setLoading(true);
      setError(null);

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/upload`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setSummary(res.data.summary);

      const newEntry = {
        filename: res.data.filename || file.name,
        summary: res.data.summary,
        date: new Date().toLocaleString(),
      };
      setHistory((prev) => [newEntry, ...prev]);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again!");
    } finally {
      setLoading(false);
    }
  };

  const handleHistoryClick = (item) => setSummary(item.summary);

  const handleDeleteHistory = (idx) => {
    const updated = history.filter((_, i) => i !== idx);
    setHistory(updated);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-3 sm:px-6 transition-colors duration-500 ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white"
          : "bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 text-gray-900"
      }`}
    >
      {/* Dark/Light Mode Toggle */}
      <div className="absolute top-6 right-6 z-10">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
            className="hidden"
          />
          <span
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
              darkMode ? "bg-yellow-400" : "bg-gray-400"
            }`}
          >
            <span
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                darkMode ? "translate-x-6" : ""
              }`}
            />
          </span>
          <span className="ml-3 text-sm font-medium">
            {darkMode ? "Dark" : "Light"}
          </span>
        </label>
      </div>

      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row w-full max-w-6xl gap-8 items-start justify-center py-12">
        {/* Upload & Summarize */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 w-full p-6 md:p-8 rounded-3xl shadow-xl backdrop-blur-xl 
                     bg-white/50 dark:bg-gray-800/50 border border-white/20"
        >
          <h1 className="text-2xl md:text-3xl font-bold mb-8 text-center tracking-tight">
            📄 Document Summarizer
          </h1>

          <form onSubmit={onSubmit} className="space-y-6">
            {/* File Upload */}
            <label
              className="flex flex-col items-center justify-center w-full h-32 px-4 py-6 
                              border-2 border-dashed rounded-2xl cursor-pointer 
                              bg-white/40 dark:bg-gray-700/40 backdrop-blur-sm
                              hover:bg-white/60 dark:hover:bg-gray-700/60
                              transition-all duration-300 text-center"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
            >
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) => setFile(e.target.files[0])}
                className="hidden"
              />
              {file ? (
                <p className="text-base sm:text-lg font-medium text-blue-600 dark:text-blue-400 truncate max-w-[90%]">
                  {file.name}
                </p>
              ) : (
                <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                  Drag & drop or click to upload PDF/Image
                </p>
              )}
            </label>

            {/* Length Select */}
            <motion.select
              whileHover={{ scale: 1.01 }}
              value={length}
              onChange={(e) => setLength(e.target.value)}
              className="w-full rounded-xl p-3 
                         bg-white/60 dark:bg-gray-800/60 
                         border border-gray-200 dark:border-gray-600 
                         text-gray-800 dark:text-white
                         focus:ring-2 focus:ring-blue-400 dark:focus:ring-purple-500 
                         transition-all duration-300"
            >
              <option value="short">Short</option>
              <option value="medium">Medium</option>
              <option value="long">Long</option>
            </motion.select>

            {/* Submit */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.02 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold tracking-wide
                         bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg
                         hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500
                         transition-all duration-300"
            >
              {loading ? " Processing..." : " Upload & Summarize"}
            </motion.button>
          </form>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 mt-4 text-center font-medium"
            >
              {error}
            </motion.p>
          )}

          {summary && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8 p-6 rounded-2xl border border-white/20 dark:border-gray-600 
                         bg-white/70 dark:bg-gray-700/70 backdrop-blur-md shadow-lg"
            >
              <h3 className="text-xl text-amber-400 font-semibold mb-3">
                Summary
              </h3>
              <div
                className="leading-relaxed text-gray-800 dark:text-gray-200 
                           [&>span]:text-green-400 [&>span]:font-bold [&>span]:text-lg"
                dangerouslySetInnerHTML={{ __html: summary }}
              />
            </motion.div>
          )}
        </motion.div>

        {/* History Section */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="flex-[1.2] w-full p-6 md:p-8 rounded-3xl shadow-xl backdrop-blur-xl 
                     bg-white/50 dark:bg-gray-700/50 border border-white/20 
                     min-h-[350px] max-h-[700px] overflow-y-auto 
                     scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-transparent"
        >
          <h2 className="text-xl md:text-2xl font-bold mb-6 text-center">
            Previous Summaries
          </h2>
          {history.length > 0 ? (
            <div className="flex flex-col gap-4">
              {history.map((item, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => handleHistoryClick(item)}
                  className="p-4 rounded-xl bg-white/40 dark:bg-gray-800/60 shadow 
                             border border-white/10 flex flex-col cursor-pointer group 
                             transition-all duration-300"
                >
                  {/* Header */}
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-blue-500 dark:text-blue-300 text-sm truncate max-w-[65%]">
                      {item.filename}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 dark:text-gray-300">
                        {item.date}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteHistory(idx);
                        }}
                        className="opacity-70 group-hover:opacity-100 transition p-1 
                                   rounded-full bg-red-500 hover:bg-red-600 text-white shadow"
                        title="Delete this summary"
                        aria-label="Delete summary"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  {/* Summary */}
                  <div
                    className="text-gray-700 dark:text-gray-200 text-sm line-clamp-3 
                               [&>span]:text-yellow-400 [&>span]:font-semibold [&>span]:text-base"
                    dangerouslySetInnerHTML={{ __html: item.summary }}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600 dark:text-gray-400">
              No previous summaries yet.
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
