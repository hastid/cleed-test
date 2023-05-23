import { useState } from "react";
import { toast } from "react-hot-toast";
import { useDropzone } from "react-dropzone";
import { Button, Progress } from "reactstrap";

import IconifyIcon from "./Icon";
import { instance } from "../config/axios";

interface FileProp {
  name: string;
  type: string;
  size: number;
}

// Upload File to Server
const uploadFiles = (file: any, onUploadProgress: any) => {
  let formData = new FormData();

  formData.append("file", file);

  return instance.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress,
  });
};

// Check file for rendring avatar
const renderFilePreview = (file: FileProp) => {
  if (file.type.startsWith("image")) {
    return (
      <img
        width={38}
        height={38}
        alt={file.name}
        src={URL.createObjectURL(file as any)}
      />
    );
  } else {
    return <IconifyIcon icon="tabler:file-description" />;
  }
};

const UploadBox = () => {
  const [progress, setProgress] = useState(0);
  const [files, setFiles] = useState<File[]>([]);

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
    },
    onDrop: (acceptedFiles: File[]) => {
      setFiles(acceptedFiles.map((file: File) => Object.assign(file)));
    },
  });

  const handleUpload = () => {
    // Handle the selected file
    const file = files[0];

    if (file) {
      uploadFiles(file, (event: any) => {
        // for set progress
        setProgress(Math.round((100 * event.loaded) / event.total));
      })
        .then((response) => {
          setProgress(0);
          toast.success(response.data.message);
        })
        .catch((error) => {
          setProgress(0);
          if (error.response?.data) {
            toast.error(error.response?.data);
          } else if (error.message) {
            toast.error(error.message);
          } else {
            toast.error("Something wrong");
          }
        });
    }
  };

  return (
    <>
      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} />
        <div
          style={{
            cursor: "pointer",
            display: "flex",
            textAlign: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              marginBottom: 8.75,
              width: 48,
              height: 48,
              display: "flex",
              borderRadius: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IconifyIcon icon="tabler:upload" fontSize="1.75rem" />
          </div>
          <p style={{ marginBottom: 2.5, fontSize: "1.375rem" }}>
            Drop files here or click to upload.
          </p>
          <p style={{ color: "grey", fontSize: "0.9375rem" }}>
            Allowed *.jpeg, *.jpg, *.png, *.gif
          </p>
        </div>
      </div>
      {files.length ? (
        <>
          {files.map((file, index) => {
            return (
              <div key={index} className="file-container">
                <div className="file-details">
                  <div className="file-preview">{renderFilePreview(file)}</div>
                  <div>
                    <p className="file-name">{file.name}</p>
                    <p className="file-size">
                      {Math.round(file.size / 100) / 10 > 1000
                        ? `${(Math.round(file.size / 100) / 10000).toFixed(
                            1
                          )} mb`
                        : `${(Math.round(file.size / 100) / 10).toFixed(1)} kb`}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="buttons">
            <Button onClick={handleUpload}>Upload File</Button>
          </div>
          {progress ? (
            <Progress className="mt-3" striped value={progress} />
          ) : null}
        </>
      ) : null}
    </>
  );
};

export default UploadBox;
