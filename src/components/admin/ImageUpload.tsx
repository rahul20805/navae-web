"use client";

import { useState, useRef } from "react";

interface ImageUploadProps {
  value: string | string[];
  onChange: (url: string | string[]) => void;
  multiple?: boolean;
}

export default function ImageUpload({ value, onChange, multiple = false }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const images = Array.isArray(value) ? value : value ? [value] : [];

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setUploading(true);
    setError("");

    try {
      const files = Array.from(e.target.files);
      const uploadedUrls: string[] = [];

      for (const file of files) {
        const response = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
          method: "POST",
          body: file,
        });

        if (!response.ok) {
          throw new Error("Upload failed");
        }

        const data = await response.json();
        uploadedUrls.push(data.url);
      }

      if (multiple) {
        onChange([...images, ...uploadedUrls]);
      } else {
        onChange(uploadedUrls[0]);
      }
    } catch (err: any) {
      setError(err.message || "Failed to upload image");
    } finally {
      setUploading(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  const handleRemove = (urlToRemove: string) => {
    if (multiple) {
      onChange(images.filter((url) => url !== urlToRemove));
    } else {
      onChange("");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {images.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
          {images.map((url, idx) => (
            <div key={idx} style={{ position: "relative", width: "120px", height: "120px", borderRadius: "8px", overflow: "hidden", border: "1px solid #ddd" }}>
              <img src={url} alt="Uploaded" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <button 
                type="button"
                onClick={() => handleRemove(url)}
                style={{ position: "absolute", top: "5px", right: "5px", background: "rgba(255,0,0,0.8)", color: "white", border: "none", borderRadius: "50%", width: "24px", height: "24px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px" }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {(!images.length || multiple) && (
        <div>
          <input
            type="file"
            ref={inputRef}
            onChange={handleUpload}
            accept="image/*"
            multiple={multiple}
            style={{ display: "none" }}
          />
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem", border: "2px dashed #ddd", borderRadius: "8px", background: "transparent", cursor: uploading ? "not-allowed" : "pointer", width: "100%" }}
          >
            {uploading ? "Uploading..." : "Drag & Drop or Click to Upload Image"}
          </button>
          {error && <p style={{ color: "red", fontSize: "0.85rem", marginTop: "0.5rem" }}>{error}</p>}
        </div>
      )}
    </div>
  );
}
