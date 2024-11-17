import { useState } from "react";
import { FaSave, FaTimes } from "react-icons/fa";


function validateStringValue(title) {
    console.log(title.length)
    if (!title) return "Pole nie może być puste";
    //if (title.length < 4) return "Nazwa wydatku jest za krótka";
    if (title.length > 50) return "Nazwa wydatku jest za długa";
}

function isValidDate(date) {
    if (!date) return false;
    const [year, month, day] = date.split("-").map(Number);
    if (
        isNaN(year) ||
        isNaN(month) ||
        isNaN(day) ||
        year < 1 ||
        month < 1 ||
        month > 12 ||
        day < 1 ||
        day > 31
    ) {
        return false;
    }
    const parsedDate = new Date(date);
    return (
        parsedDate.getFullYear() === year &&
        parsedDate.getMonth() + 1 === month &&
        parsedDate.getDate() === day
    );
}

function validateDate(date) {
    if (!date) return "Pole nie może być puste";
    if (!isValidDate(date)) return "Data jest niepoprawna";
    if (new Date(date) < new Date()) return "Data nie może być wcześniejsza niż obecna";
}


function validateAmount(amount) {
    if (!amount) return "Pole nie może być puste";
    if (amount <= 0 || isNaN(amount)) return "Pole musi być liczbą większą od zera";
}


export default function EditAmountForm({ amount, onSave, onCancel }) {


    const [formState, setFormState] = useState({
        title: amount?.title || "",
        amount: amount?.amount || "",
        category: amount?.category || "",
        date: amount.date
            ? (typeof amount.date === "string" ? amount.date : amount.date.toISOString().substring(0, 10))
            : "",
        description: amount?.description || "",
    });;

    const [errors, setErrors] = useState({});

    const handleSave = () => {
        if (handleValidate()) {
            const updatedAmount = {
                ...amount,
                title: formState.title,
                amount: parseFloat(formState.amount),
                category: formState.category,
                date: formState.date ? new Date(formState.date) : null, // Konwersja daty
                description: formState.description,
            };
            onSave(updatedAmount);
        }
    };


    const handleChange = (field, value) => {
        setFormState((prevState) => ({ ...prevState, [field]: value }));
    };

    const handleValidate = () => {
        const errors = {};
        const titleError = validateStringValue(formState.title);
        if (titleError) errors.title = titleError;

        const categoryError = validateStringValue(formState.category);
        if (categoryError) errors.category = categoryError;

        const dateError = validateDate(formState.date);
        if (dateError) errors.date = dateError;

        const amountError = validateAmount(formState.amount);
        if (amountError) errors.amount = amountError;

        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    return (
        <div>
            <label htmlFor="title">Nazwa wydatku</label>
            <input
                id="title"
                className={'add-form-input'}
                value={formState.title}
                onChange={(e) => handleChange("title", e.target.value)}
            />
            {errors.title && <p className="error-p">{errors.title}</p>}

            <label htmlFor="amount">Kwota</label>
            <input
                id="amount"
                className={'add-form-input'}
                type="number"
                value={formState.amount}
                onChange={(e) => handleChange("amount", e.target.value)}
            />
            {errors.amount && <p className="error-p">{errors.amount}</p>}

            <label htmlFor="category">Kategoria</label>
            <input
                id="category"
                className={'add-form-input'}
                value={formState.category}
                onChange={(e) => handleChange("category", e.target.value)}
            />
            {errors.category && <p className="error-p">{errors.category}</p>}

            <label htmlFor="date">Data</label>
            <input
                id="date"
                className={'add-form-input'}
                type="date"
                value={formState.date}
                onChange={(e) => handleChange("date", e.target.value)}
            />
            {errors.date && <p className="error-p">{errors.date}</p>}

            <label htmlFor="description">Opis</label>
            <textarea
                id="description"
                className={'add-form-input'}
                value={formState.description}
                onChange={(e) => handleChange("description", e.target.value)}
            />
            {errors.description && <p className="error-p">{errors.description}</p>}
            <button onClick={handleSave}>
                <FaSave /> Zapisz
            </button>
            <button onClick={onCancel}>
                <FaTimes /> Anuluj
            </button>
        </div>
    );
}
