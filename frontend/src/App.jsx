import { useState } from "react";

function App() {

  const [url, setUrl] = useState("");
  const [qrImage, setQrImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateQR = async () => {

    if (!url) {
      setError("Please enter a URL");
      return;
    }

    setLoading(true);
    setError("");
    setQrImage("");

    try {

      const apiUrl =
        `${import.meta.env.VITE_API_URL}/generate-qr?url=${encodeURIComponent(url)}`;

      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error("Unable to generate QR code");
      }

      const blob = await response.blob();

      const imageUrl = URL.createObjectURL(blob);

      setQrImage(imageUrl);

    } catch (err) {

      setError(err.message);

    } finally {

      setLoading(false);

    }
  };


  return (
    <div style={{
      maxWidth: "600px",
      margin: "50px auto",
      padding: "30px",
      textAlign: "center",
      fontFamily: "Arial"
    }}>

      <h1>QR Code Generator</h1>

      <p>
        Enter a URL to generate a QR code
      </p>

      <input
        type="url"
        placeholder="https://example.com"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{
          width: "90%",
          padding: "12px",
          fontSize: "16px"
        }}
      />

      <br />
      <br />

      <button
        onClick={generateQR}
        disabled={loading}
        style={{
          padding: "12px 25px",
          fontSize: "16px",
          cursor: "pointer"
        }}
      >
        {loading ? "Generating..." : "Generate QR"}
      </button>

      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}

      {qrImage && (
        <div style={{ marginTop: "30px" }}>

          <h3>Generated QR Code</h3>

          <img
            src={qrImage}
            alt="Generated QR Code"
            width="300"
          />

          <br />
          <br />

          <a
            href={qrImage}
            download="qr-code.png"
          >
            Download QR Code
          </a>

        </div>
      )}

    </div>
  );
}
//hello//sss
export default App;