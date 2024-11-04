import { FaTrash } from 'react-icons/fa';


export default function Amount({ id, title, amount, category, date, description, onRemove = f => f, onShow= f=>f }) {

    return (
        <section>
            <h1>{title}</h1>
            <button onClick={() => onRemove(id)}>
                <FaTrash />
            </button>
            <button onClick={() => onShow(amount)}> {}
                Pokaż szczegóły
            </button>
            <p>produkt z kategorii {category}, kwota wydana: {amount} zł, data: {date}</p>



        </section>
    );
}


