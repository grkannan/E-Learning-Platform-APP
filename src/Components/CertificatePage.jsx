import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';

const CertificatePage = () => {
  const { courseId } = useParams();
  const [certificateUrl, setCertificateUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const response = await axiosInstance.post(`/api/certificate/issue/${courseId}/`);
        setCertificateUrl(response.data.certificate_url);
        setMessage(response.data.message);
        setError('');
      } catch (err) {
        if (err.response?.status === 403) {
          setError(err.response.data?.message || 'You are not eligible to receive a certificate. Score must be 75% or higher.');
        } else if (err.response?.status === 404) {
          setError('Course not found.');
        } else {
          setError('Something went wrong while generating the certificate.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [courseId]);

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg text-center">
      <h1 className="text-2xl font-bold mb-6">🎓 Course Certificate</h1>

      {/* Back to Course */}
      <Link
        to={`/course/${courseId}/lessons`}
        className="text-blue-600 hover:underline text-sm inline-block mb-4"
      >
        ← Back to Course Lessons
      </Link>

      {loading && <p>⏳ Checking certificate eligibility...</p>}

      {!loading && message && certificateUrl && (
        <>
          <p className="text-green-600 mb-4">{message}</p>

          {/* PDF Preview */}
          <div className="mb-6 border rounded overflow-hidden">
            <iframe
              src={certificateUrl}
              width="100%"
              height="600px"
              title="Certificate PDF"
              className="w-full"
              onError={() =>
                setError('⚠️ PDF preview failed. Please try downloading it directly.')
              }
            />
          </div>

          {/* Download Button */}
          <a
            href={certificateUrl}
            download
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 inline-block"
          >
            ⬇️ Download Certificate (PDF)
          </a>
        </>
      )}

      {!loading && error && (
        <div className="text-red-600 mt-4 font-medium">{error}</div>
      )}
    </div>
  );
};

export default CertificatePage;
