import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function UploadForm() {
  const [file, setFile] = useState(null);
  const [length, setLength] = useState("short");
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

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
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center transition-colors duration-500 ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white"
          : "bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 text-gray-900"
      }`}
    >
      {/* Dark/Light Mode Toggle */}
      <div className="absolute top-6 right-6">
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

      {/* Glass Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-xl p-8 rounded-3xl shadow-xl backdrop-blur-xl 
                   bg-white/40 dark:bg-gray-800/40 border border-white/20"
      >
        <h1 className="text-3xl font-bold mb-8 text-center tracking-tight">
          📄 Document Summarizer
        </h1>

        <form onSubmit={onSubmit} className="space-y-6">
          {/* File Upload */}
          <label className="flex flex-col items-center justify-center w-full h-32 px-4 py-6 
                            border-2 border-dashed rounded-2xl cursor-pointer 
                            bg-white/30 dark:bg-gray-700/30 backdrop-blur-sm
                            hover:bg-white/50 dark:hover:bg-gray-700/50
                            transition-all duration-300">
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={(e) => setFile(e.target.files[0])}
              className="hidden"
            />
            {file ? (
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                ✅ {file.name}
              </p>
            ) : (
              <p className="text-gray-600 dark:text-gray-300">
                Drag & drop or click to upload PDF/Image
              </p>
            )}
          </label>

          {/* Summary Length Selector */}
          <motion.select
  whileHover={{ scale: 1.01 }}
  value={length}
  onChange={(e) => setLength(e.target.value)}
  className="w-full rounded-xl p-3 
             bg-white/40 dark:bg-gray-800/40 
             border border-transparent bg-clip-padding 
             backdrop-blur-xl shadow-inner
             text-white
             focus:ring-2 focus:ring-blue-400 dark:focus:ring-purple-500 
             transition-all duration-300"
>
  <option className="bg-gray-800 text-white" value="short">Short</option>
  <option className="bg-gray-800 text-white" value="medium">Medium</option>
  <option className="bg-gray-800 text-white" value="long">Long</option>
</motion.select>

          {/* Submit Button */}
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
            {loading ? "⚡ Processing..." : "🚀 Upload & Summarize"}
          </motion.button>
        </form>

        {/* Error */}
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 mt-4 text-center font-medium"
          >
            {error}
          </motion.p>
        )}

        {/* Summary Result */}
        {summary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 p-6 rounded-2xl border border-white/20 dark:border-gray-600 
                       bg-white/50 dark:bg-gray-700/50 backdrop-blur-md shadow-lg"
          >
            <h3 className="text-xl font-semibold mb-3">✨ Summary</h3>
            <p className="leading-relaxed text-gray-800 dark:text-gray-200">
              {summary}
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
