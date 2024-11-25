'use client';
import { useEffect } from "react";
import {theme} from "../../../tailwind.config";

export default function NotificationModal({ message, onClose }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [message, onClose]);

    return (
        <div className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50`}>
            <div
                className={`p-4 rounded-lg shadow-lg relative max-w-sm w-full text-center ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-700"}`}
            >
                <p>{message}</p>
                <button
                    className={`absolute top-2 right-2 text-gray-500 hover:text-gray-700 ${theme === "dark" ? "text-white" : "text-gray-500"}`}
                    onClick={onClose}
                >
                    X
                </button>
            </div>
        </div>);
}
