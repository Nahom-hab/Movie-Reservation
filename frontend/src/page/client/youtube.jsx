import React, { useEffect, useRef } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

export default function Youtube() {
    const iframeRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation()
    const data = location.state

    useEffect(() => {
        // Load the YouTube iframe API script
        const script = document.createElement("script");
        script.src = "https://www.youtube.com/iframe_api";
        script.async = true;
        document.body.appendChild(script);

        // Attach the API when script loads
        script.onload = () => {
            const player = new window.YT.Player(iframeRef.current, {
                events: {
                    onStateChange: (event) => {
                        if (event.data === window.YT.PlayerState.ENDED) {
                            navigate("/movie"); // Navigate to /movie when the video ends
                        }
                    },
                },
            });
        };

        // Cleanup script
        return () => {
            document.body.removeChild(script);
        };
    }, [navigate]);

    return (
        <div className="flex flex-col h-screen bg-black">
            <button
                onClick={() => navigate(-1)}
                className="mb-4 px-4 py-2 flex items-center justify-start text-lg gap-2 text-white"
            >
                <FaArrowLeft />  Go Back
            </button>
            <iframe
                ref={iframeRef}
                className="w-full h-[94%] bg-black"
                src={data}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            ></iframe>
        </div>
    );
}

