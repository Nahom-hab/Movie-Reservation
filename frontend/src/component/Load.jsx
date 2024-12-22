import React from "react";
import vid from '../assets/loader.mp4'

const VideoLoader = () => {
    return (
        <div className="flex items-center py-60 px-2  justify-center h-screen bg-black">
            <video
                src={vid}
                autoPlay
                loop
                muted
                className="w-full h-full object-cover"
            ></video >
        </div >
    );
};

export default VideoLoader;
