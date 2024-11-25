'use client';
import { FaTrash } from 'react-icons/fa';
import { FaPencilAlt } from 'react-icons/fa';

export default function Amount({
                                   isHighlighted,
                                   id,
                                   title,
                                   amount,
                                   category,
                                   date,
                                   description,
                                   onRemove = f => f,
                                   onShow = f => f,
                                   onEdit = f => f,
                               }) {
    const formattedDate = date ? new Date(date).toLocaleDateString() : "";

    return (
        <section
            className={`p-4 border ${
                isHighlighted ? 'border-red-500' : 'border-gray-200'
            } rounded shadow-md hover:shadow-lg transition-shadow duration-200`}
        >
            <h1 className="text-lg font-semibold">{title}</h1>
            <p className="text-gray-700">{category}</p>
            <p className="text-gray-500 text-sm">{formattedDate}</p>
            <div className="flex items-center justify-between mt-2">
                <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => onRemove(id)}
                >
                    <FaTrash />
                </button>
                <button
                    className="text-blue-500 hover:text-blue-700"
                    onClick={() => onShow(amount)}
                >
                    Pokaż szczegóły
                </button>
                <button
                    className="text-green-500 hover:text-green-700"
                    onClick={onEdit}
                >
                    <FaPencilAlt />
                </button>
            </div>
        </section>
    );
}
