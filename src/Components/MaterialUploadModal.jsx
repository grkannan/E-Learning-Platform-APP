import React, { useState } from "react";
import axiosInstance from "../utils/axiosInstance";

const MaterialUploadModal = ({ courseId, onClose }) => {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!file || !title) {
      alert("Please fill in all fields.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("file", file);
    formData.append("course", courseId);

    try {
      setLoading(true);
      await axiosInstance.post("/api/materials/upload/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Material uploaded!");
      setTitle("");
      setFile(null);
      setLoading(false);
      onClose();
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Upload failed");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
        <h2 className="text-xl font-bold mb-4">Upload Material</h2>
        <input
          type="text"
          className="w-full mb-3 p-2 border rounded"
          placeholder="Material Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="file"
          accept="application/pdf"
          className="w-full mb-4"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MaterialUploadModal;
