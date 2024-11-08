'use client';
import React from 'react';
import {AiOutlineClose} from "react-icons/ai";

export default function Modal({ children, onClose }) {
    const handleBackdropClick = (event) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    return (
        <div style={backdropStyle} onClick={handleBackdropClick}>
            <div style={modalStyle}>
                <button onClick={onClose} style={closeButtonStyle}>
                    <AiOutlineClose size={20}/>
                </button>
                {children}
            </div>
        </div>
    );
}


const backdropStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    color: 'black'
};

const modalStyle = {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '5px',
    width: '400px',
    maxWidth: '90%',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    position: 'relative',
    color: 'black'
};

const closeButtonStyle = {
    position: 'absolute',
    top: '10px',
    right: '10px',
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '16px',
    cursor: 'pointer',
    color: 'black'
};
