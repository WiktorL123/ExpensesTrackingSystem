import {useEffect} from "react";

export default function NotificationModal({message, onClose}){
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose()
        }, 3000)

        return () => clearTimeout(timer)
    }, [message, onClose]);

    return (
        <div style={modalStyle}>
            <div style={modalContentStyle}>
                <p>{message}</p>
                <button onClick={onClose} style={closeButtonStyle}>X</button>
            </div>
        </div>
    )

}
const modalStyle = {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
};

const modalContentStyle = {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '5px',
    textAlign: 'center',
    maxWidth: '400px',
    width: '100%',
};

const closeButtonStyle = {
    position: 'absolute',
    top: '5px',
    right: '5px',
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
};