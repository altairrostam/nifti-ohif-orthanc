import React, { useState } from 'react';

const NiftiUploader = ({ onUploadComplete }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && (selectedFile.name.endsWith('.nii') || selectedFile.name.endsWith('.nii.gz'))) {
      setFile(selectedFile);
    } else {
      alert('Please select a valid .nii or .nii.gz file.');
      event.target.value = null; // Reset the file input
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    // TODO: Implement your API call here
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Replace with your API endpoint
      const response = await fetch('http://localhost:8000/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        onUploadComplete();
      } else {
        console.error('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
      <input
        type="file"
        accept=".nii,.nii.gz,application/gzip"
        onChange={handleFileChange}
        style={{ marginBottom: '10px' }}
      />
      <button 
        onClick={handleUpload} 
        disabled={!file}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          fontWeight: 'bold',
          color: 'white',
          backgroundColor: file ? '#4CAF50' : '#ccc',
          border: 'none',
          borderRadius: '5px',
          cursor: file ? 'pointer' : 'not-allowed',
          transition: 'background-color 0.3s ease'
        }}
      >
        {file ? 'Upload Nifti' : 'Select a file to upload'}
      </button>
      {file && <p style={{ marginTop: '10px' }}>Selected file: {file.name}</p>}
    </div>
  );
};

export default NiftiUploader;