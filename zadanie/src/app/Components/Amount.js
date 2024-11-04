import { FaTrash } from 'react-icons/fa';
import { useState } from 'react';

export default function Amount({ id, title, amount, category, date, description, onRemove = f => f }) {
    const [showModal, setShowModal] = useState(false);

    return (
        <section>
            <h1>{title}</h1>
            <button onClick={() => onRemove(id)}>
                <FaTrash />
            </button>
            <button onClick={() => setShowModal(true)}> {}
                Pokaż szczegóły
            </button>
            <p>produkt z kategorii {category}, kwota wydana: {amount} zł, data: {date}</p>


            {/*{showModal && (*/}
            {/*    <div style={modalStyles.overlay}>*/}
            {/*        <div style={modalStyles.modal}>*/}
            {/*            <h2>Szczegóły</h2>*/}
            {/*            <p>{description}</p>*/}
            {/*            <button onClick={() => setShowModal(false)}>Zamknij</button> {}*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*)}*/}
        </section>
    );
}


const modalStyles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',

    },
    modal: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        width: '300px',
        textAlign: 'center',
        color: 'black'
    },
};
