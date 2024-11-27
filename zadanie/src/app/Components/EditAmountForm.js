import React, { useState } from "react";
import { FaSave, FaTimes } from "react-icons/fa";
import {useAmountsContext} from "@/app/providers/AmountProvider";
import {AiOutlineClose} from "react-icons/ai";


function validateStringValue(stringValue) {
    console.log(stringValue.length)
    if (stringValue.length<3)  return  "wartosc jest za krotka - minumum 3  znaki"
    if (!stringValue) return "Pole nie może być puste";
    if (stringValue.length > 50) return "wartosc jest za długa - maks 50 znaków";
}
function validateDescription(description) {
    if (description.length<=5)  return  "wartosc jest za krotka"
    if (!description) return "Pole nie może być puste";

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

}


function validateAmount(amount) {
    if (!amount) return "Pole nie może być puste";
    if (amount <= 0 || isNaN(amount)) return "Pole musi być liczbą większą od zera";
}


export default function EditAmountForm() {
    const {editingAmount, handleSaveEdit, handleCancelEdit, setEditingAmount} = useAmountsContext()


    const [formState, setFormState] = useState({
        title: editingAmount?.title || "",
        amount: editingAmount?.amount || "",
        category: editingAmount?.category || "",
        date: editingAmount.date
            ? (typeof editingAmount.date === "string" ? editingAmount.date : editingAmount.date.toISOString().substring(0, 10))
            : "",
        description: editingAmount?.description || "",
    })

    const [errors, setErrors] = useState({});

    const handleSave = () => {
        if (handleValidate()) {
            const updatedAmount = {
                ...editingAmount,
                title: formState.title,
                amount: parseFloat(formState.amount),
                category: formState.category,
                date: formState.date ? new Date(formState.date) : null,
                description: formState.description,
            };
            handleSaveEdit(updatedAmount);
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

        const descriptionError = validateDescription(formState.description)
        if (descriptionError) errors.description = descriptionError

        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
                <button
                    onClick={() => setEditingAmount(null)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                    <AiOutlineClose size={20}/>
                </button>
                <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
                    Edytuj Wydatek
                </h2>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSave();
                    }}
                    className="space-y-4"
                >
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                            Nazwa wydatku
                        </label>
                        <input
                            id="title"
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black placeholder-black"
                            placeholder="Wpisz nazwę wydatku"
                            value={formState.title}
                            onChange={(e) => handleChange("title", e.target.value)}
                        />
                        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                    </div>

                    <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                            Kwota
                        </label>
                        <input
                            id="amount"
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black placeholder-black"
                            type="number"
                            placeholder="Podaj kwotę"
                            value={formState.amount}
                            onChange={(e) => handleChange("amount", e.target.value)}
                        />
                        {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
                    </div>

                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                            Kategoria
                        </label>
                        <input
                            id="category"
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black placeholder-black"
                            placeholder="Podaj kategorię"
                            value={formState.category}
                            onChange={(e) => handleChange("category", e.target.value)}
                        />
                        {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                    </div>

                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                            Data
                        </label>
                        <input
                            id="date"
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black placeholder-black"
                            type="date"
                            value={formState.date}
                            onChange={(e) => handleChange("date", e.target.value)}
                        />
                        {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Opis
                        </label>
                        <textarea
                            id="description"
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 h-20 resize-none text-black placeholder-black"
                            placeholder="Dodaj opis wydatku"
                            value={formState.description}
                            onChange={(e) => handleChange("description", e.target.value)}
                        />
                        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                    </div>

                    <div className="flex space-x-4">
                        <button
                            type="submit"
                            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            <FaSave className="inline mr-2" /> Zapisz
                        </button>
                        <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                            <FaTimes className="inline mr-2" /> Anuluj
                        </button>
                    </div>
                </form>
            </div>
        </div>


    );
}
