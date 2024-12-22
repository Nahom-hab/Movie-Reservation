import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import jsQR from 'jsqr';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

export default function QRCodeScanner() {
    const [scanResult, setScanResult] = useState(null);
    const [scanning, setScanning] = useState(true);  // State to manage whether the scanner is active
    const webcamRef = useRef(null);
    const navigate = useNavigate();

    const capture = () => {
        const imageSrc = webcamRef.current.getScreenshot();  // Capture the screenshot from the webcam
        if (imageSrc) {
            const image = new Image();
            image.src = imageSrc;
            image.onload = () => {
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.width = image.width;
                canvas.height = image.height;
                context.drawImage(image, 0, 0, image.width, image.height);

                const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, canvas.width, canvas.height);

                if (code) {
                    setScanResult(code.data);  // Set the scanned data
                    setScanning(false);  // Stop scanning
                }
            };
        }
    };

    // Start capturing every second if scanning is true
    useEffect(() => {
        if (scanning) {
            const interval = setInterval(capture, 1000);  // Capture frame every 1 second
            return () => clearInterval(interval);  // Clear interval on unmount or when scanning stops
        }
    }, [scanning]);

    const handleScanAgain = () => {
        // Restart scanning if you want to scan again
        setScanResult(null);
        setScanning(true);  // Enable scanning again
    };

    return (
        <div className="flex flex-col items-center p-5 min-h-screen bg-gray-900  shadow-md">
            <div onClick={() => navigate(-1)} className='fixed z-10 gap-2 flex items-center text-white bg-slate-800 font-semibold p-3 py-2 rounded-2xl text-xl  top-3 left-4'>
                <FaArrowLeft />Back
            </div>
            <h2 className="font-bold text-2xl bg-gradient-to-r from-yellow-400 to-red-400  bg-clip-text text-transparent  mb-4">Scan Ticket</h2>
            <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className='h-[45vh] w-full'
                width="100%"
                videoConstraints={{ facingMode: 'environment' }}
            />

            {/* Show scan result only after scanning is complete */}
            {scanResult && !scanning && (
                <div className="mt-4 bg-gray-800 p-4 rounded-lg text-white">
                    <h3 className="text-lg font-bold">Scanned Data:</h3>
                    <pre className="whitespace-pre-wrap">
                        {JSON.stringify(JSON.parse(scanResult), null, 2)}
                    </pre>
                    <button
                        onClick={handleScanAgain}
                        className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
                    >
                        Scan Again
                    </button>
                </div>
            )}
        </div>
    );
}
