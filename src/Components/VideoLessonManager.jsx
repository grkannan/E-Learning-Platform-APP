import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from '../utils/axiosInstance';

const VideoLessonManager = ({ courseId }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videofile: null,
    thumbnail: null,
    duration: '',
    order: ''
  });

  const [previewURL, setPreviewURL] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  const hiddenVideoRef = useRef(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('access');

  useEffect(() => {
    if (!courseId) return;

    axiosInstance.get(`/api/instructor/course/${courseId}/videos/`)
      .then((res) => {
        const nextOrder = res.data.length + 1;
        setFormData((prev) => ({ ...prev, order: nextOrder }));
      })
      .catch((err) => {
        console.error('Failed to fetch videos:', err);
      });
  }, [courseId]);

  const convertSecondsToHHMMSS = (totalSeconds) => {
    const h = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const s = String(Math.floor(totalSeconds % 60)).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const validateForm = () => {
    const { title, description, videofile, thumbnail, duration, order } = formData;
    if (!title || !description || !videofile || !thumbnail || !duration || !order) {
      alert('⚠️ All fields are required!');
      return false;
    }
    return true;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('video/')) {
      const url = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, videofile: file }));
      setPreviewURL(url);

      const tempVideo = hiddenVideoRef.current;
      tempVideo.src = url;
      tempVideo.load();
    } else {
      alert('❌ Please select a valid video file.');
      setFormData((prev) => ({ ...prev, videofile: null, duration: '' }));
      setPreviewURL(null);
    }
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setFormData((prev) => ({ ...prev, thumbnail: file }));
      setThumbnailPreview(URL.createObjectURL(file));
    } else {
      alert('❌ Please select a valid image file.');
      setFormData((prev) => ({ ...prev, thumbnail: null }));
      setThumbnailPreview(null);
    }
  };

  const handleMetadataLoaded = () => {
    const durationInSeconds = hiddenVideoRef.current.duration;
    const formatted = convertSecondsToHHMMSS(durationInSeconds);
    setFormData((prev) => ({ ...prev, duration: formatted }));
  };

  const handleUpload = async () => {
    if (!validateForm()) return;

    const data = new FormData();
    data.append('course', courseId);
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('videofile', formData.videofile);
    data.append('thumbnail', formData.thumbnail);
    data.append('duration', formData.duration);
    data.append('order', formData.order);

    try {
      await axiosInstance.post('/api/instructor/videos/upload/', data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('✅ Video uploaded successfully!');
      navigate('/instructor-dashboard');
      setFormData({
        title: '',
        description: '',
        videofile: null,
        thumbnail: null,
        duration: '',
        order: ''
      });
      setPreviewURL(null);
      setThumbnailPreview(null);
    } catch (err) {
      console.error(err);
      alert('❌ Upload failed. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-xl bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">🎬 Upload Video Lesson</h2>

        <div className="text-center mb-6">
          <Link to="/instructor-dashboard" className="text-blue-600 hover:underline text-sm font-medium">
            ← Back to Dashboard
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Video Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="input-style"
          />
          <input
            type="text"
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="input-style"
          />

          <div className="col-span-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Video File</label>
            <input
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="input-style file:bg-blue-600 file:text-white file:border-0 file:px-4 file:py-2 file:rounded-md"
            />
          </div>

          <div className="col-span-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Thumbnail Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleThumbnailChange}
              className="input-style file:bg-green-600 file:text-white file:border-0 file:px-4 file:py-2 file:rounded-md"
            />
          </div>

          <input
            type="text"
            placeholder="Duration"
            value={formData.duration}
            readOnly
            className="input-style bg-gray-100 cursor-not-allowed"
          />
          <input
            type="number"
            placeholder="Order"
            value={formData.order}
            onChange={(e) => setFormData({ ...formData, order: e.target.value })}
            className="input-style"
          />
          <button
            onClick={handleUpload}
            className="col-span-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-semibold transition"
          >
            Upload Video
          </button>
        </div>

        {previewURL && (
          <div className="mt-6">
            <h3 className="text-md font-semibold text-gray-700 mb-2">📺 Video Preview</h3>
            <video
              src={previewURL}
              controls
              className="w-full rounded-lg shadow-md"
            />
          </div>
        )}

        {thumbnailPreview && (
          <div className="mt-4">
            <h3 className="text-md font-semibold text-gray-700 mb-2">🖼️ Thumbnail Preview</h3>
            <img src={thumbnailPreview} alt="Thumbnail preview" className="w-full h-auto rounded-lg shadow" />
          </div>
        )}

        {/* Hidden video to extract duration */}
        <video
          ref={hiddenVideoRef}
          className="hidden"
          onLoadedMetadata={handleMetadataLoaded}
        />
      </div>
    </div>
  );
};

export default VideoLessonManager;
