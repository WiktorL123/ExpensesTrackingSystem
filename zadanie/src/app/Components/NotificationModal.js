'use client';
import { useEffect, useState } from "react";

export default function NotificationModal({ message, onClose }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);

        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 500);
        }, 3000);

        return () => clearTimeout(timer);
    }, [message, onClose]);

    return (
        <div
            className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-500 ${
                isVisible ? "opacity-100" : "opacity-0"
            }`}
        >
            <div
                className={`p-4 rounded-lg shadow-lg relative max-w-sm w-full text-center transform transition-transform duration-500 ${
                    isVisible ? "scale-100" : "scale-90"
                } bg-white text-gray-700`}
            >
                <p>{message}</p>
                <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                    onClick={() => setIsVisible(false)}
                >
                    X
                </button>
            </div>
        </div>
    );
}
