import React, { useState } from 'react';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');
  const [conversation, setConversation] = useState([]);
  const [query, setQuery] = useState('');
  const [queryLoading, setQueryLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadedFileId, setUploadedFileId] = useState(null);

  const handleFileChange = (e) => {
    setError('');
    const selectedFile = e.target.files[0];
    // Validate file type
    if (selectedFile && selectedFile.type !== 'application/pdf') {
      setError('Unsupported file type. Please upload a PDF file.');
      return;
    }
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a PDF file to upload.');
      return;
    }
    setError('');
    setUploading(true);
    setUploadMessage('Uploading PDF...');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${process.env.REACT_APP_URL}/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || 'Upload failed');
      }
      setUploadMessage('PDF processed successfully.');
      setUploadedFileId(data.file_id);
    } catch (err) {
      setError(err.message || 'An error occurred while uploading.');
    } finally {
      setUploading(false);
    }
  };

  const handleQuerySubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
      setError('Please enter a query.');
      return;
    }
    setError('');
    setQueryLoading(true);
    // Add user query to conversation view
    setConversation(prev => [...prev, { role: 'user', text: query }]);

    try {
      const res = await fetch(`${process.env.REACT_APP_URL}/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query, max_length: 200 })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || 'Query failed');
      }
      // Append assistant's response to the conversation
      setConversation(prev => [...prev, { role: 'assistant', text: data.response }]);
      setQuery('');
    } catch (err) {
      setError(err.message || 'An error occurred while processing your query.');
    } finally {
      setQueryLoading(false);
    }
  };

  return (
    <div className="app-wrapper">

      <main className="app-main">
        <section className="upload-section">
          <h2>Upload PDF</h2>
          <input type="file" accept="application/pdf" onChange={handleFileChange} />
          <button onClick={handleUpload} disabled={uploading}>
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
          {uploadMessage && <p className="info-message">{uploadMessage}</p>}
          {/* Display the file ID if available */}
          {uploadedFileId && (
            <p className="info-message">
              Uploaded File ID: <strong>{uploadedFileId}</strong>
            </p>
          )}
        </section>

        <section className="chat-section">
          <h2>Ask a Question</h2>
          <div className="chat-window">
            {conversation.map((msg, idx) => (
              <div key={idx} className={`chat-bubble ${msg.role}`}>
                <p>{msg.text}</p>
              </div>
            ))}
          </div>
          <form onSubmit={handleQuerySubmit} className="chat-input-form">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter your question..."
            />
            <button type="submit" disabled={queryLoading}>
              {queryLoading ? 'Processing...' : 'Send'}
            </button>
          </form>
        </section>

        {error && <div className="error-message">{error}</div>}
      </main>

    </div>
  );
}

export default App;
