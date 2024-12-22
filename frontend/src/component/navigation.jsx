import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const sidebarRef = useRef(null);
    const overlayRef = useRef(null);

    // Toggle sidebar open/close
    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    // Close sidebar if clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                sidebarRef.current && !sidebarRef.current.contains(event.target) &&
                overlayRef.current && !overlayRef.current.contains(event.target)
            ) {
                setIsOpen(false); // Close sidebar if clicked outside
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    ref={overlayRef}
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={toggleSidebar}
                ></div>
            )}

            {/* Sidebar */}
            <div
                ref={sidebarRef}
                className={`md:hidden fixed z-50 top-0 left-0 w-64 h-screen pt-20 bg-gray-900 text-white transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <div className="flex flex-col items-center p-6">
                    <Link
                        to={'/admin'}
                        className="w-full text-center px-6 py-3 text-white hover:bg-gray-700 rounded-lg mb-4 transition-all ease-in-out duration-300 transform hover:scale-105"
                    >
                        Home
                    </Link>
                    <Link
                        to={'/admin/scanner'}
                        className="w-full text-center px-6 py-3 text-white hover:bg-gray-700 rounded-lg mb-4 transition-all ease-in-out duration-300 transform hover:scale-105"
                    >
                        QR Scanner
                    </Link>
                    <Link
                        to={'/admin/settings'}
                        className="w-full text-center px-6 py-3 text-white hover:bg-gray-700 rounded-lg mb-4 transition-all ease-in-out duration-300 transform hover:scale-105"
                    >
                        Settings
                    </Link>

                </div>
            </div>

            {/* Button to toggle sidebar */}
            <button
                onClick={toggleSidebar}
                className="fixed top-5 left-5 z-50 bg-gray-900 text-white p-3 rounded-full hover:bg-gray-700 transition-all duration-300"
            >
                {isOpen ? 'Close' : 'Open'} Menu
            </button>
        </>
    );
}
