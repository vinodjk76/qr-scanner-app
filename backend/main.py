from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware

import qrcode
import io
from urllib.parse import urlparse


app = FastAPI(
    title="QR Scanner Image API",
    version="1.0.0"
)

# Development CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": "QR Scanner API is running",
        "status": "success"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


@app.get("/generate-qr")
def generate_qr(url: str):

    if not url:
        raise HTTPException(
            status_code=400,
            detail="URL is required"
        )

    # Basic URL validation
    parsed = urlparse(url)

    if parsed.scheme not in ["http", "https"]:
        raise HTTPException(
            status_code=400,
            detail="Only HTTP/HTTPS URLs are supported"
        )

    # Generate QR code
    qr = qrcode.QRCode(
        version=1,
        box_size=10,
        border=4
    )

    qr.add_data(url)
    qr.make(fit=True)

    image = qr.make_image(
        fill_color="black",
        back_color="white"
    )

    # Store image in memory
    image_bytes = io.BytesIO()
    image.save(image_bytes, format="PNG")

    image_bytes.seek(0)

    return StreamingResponse(
        image_bytes,
        media_type="image/png",
        headers={
            "Content-Disposition": "inline; filename=qr-code.png"
        }
    )