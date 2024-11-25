'use client';
import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { useAmountsContext } from "@/app/providers/AmountProvider";

export default function Modal() {
    const { selectedAmount, setSelectedAmount, handleBackdropClick } = useAmountsContext();

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={handleBackdropClick}
        >
            <div
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg relative w-80 max-w-full"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={() => setSelectedAmount(null)}
                    className="absolute top-3 right-3 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
                >
                    <AiOutlineClose size={20} />
                </button>
                <h1 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{selectedAmount.title}</h1>
                <p className="text-gray-600 dark:text-gray-300">{selectedAmount.description}</p>
            </div>
        </div>
    );
}
