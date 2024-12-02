

'use client';
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from 'yup';
import {useAmountsContext} from "@/app/providers/AmountProvider";

const validationSchema = Yup.object({
    title: Yup.string().min(3, 'Tytuł jest za krótki')
        .required('Tytuł jest wymagany'),
    amount: Yup.number().positive('Tylko ligiczby dodatnie')
        .required('Kwota wymagana'),
    category: Yup.string()
        .required('Kategoria wymagana!'),
    date: Yup.date().typeError('NIEPRAWIDŁOWA DATA')
        .required('Data wymagana!'),
    description: Yup.string().min(5, 'Opis jest za krótki')
        .max(50, 'Opis jest za długi!')
        .required('Wprowadź opis!!!')
});

const initialValues = {
    title: '',
    amount: 1,
    category: '',
    date: '',
    description: ''
};
export default function AddAmountForm() {
    const {addAmount} = useAmountsContext()

    const handleSubmit = (values, { resetForm }) => {
        addAmount(
            values.title,
            values.amount,
            values.category.toLowerCase(),
            values.date,
            values.description
        );
        resetForm();
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ dirty, isValid }) => (
                <Form className="bg-white shadow-md rounded-lg p-6 space-y-4 max-w-md mx-auto">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                            Tytuł
                        </label>
                        <Field
                            id="title"
                            name="title"
                            type="text"
                            placeholder="Podaj tytuł"
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black placeholder-black"
                        />
                        <ErrorMessage
                            name="title"
                            component="div"
                            className="text-red-500 text-sm mt-1"
                        />
                    </div>

                    <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                            Kwota
                        </label>
                        <Field
                            id="amount"
                            name="amount"
                            type="number"
                            placeholder="Podaj kwotę"
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black placeholder-black"
                        />
                        <ErrorMessage
                            name="amount"
                            component="div"
                            className="text-red-500 text-sm mt-1"
                        />
                    </div>

                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                            Kategoria
                        </label>
                        <Field
                            id="category"
                            name="category"
                            type="text"
                            placeholder="Podaj kategorię"
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black placeholder-black"
                        />
                        <ErrorMessage
                            name="category"
                            component="div"
                            className="text-red-500 text-sm mt-1"
                        />
                    </div>

                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                            Data
                        </label>
                        <Field
                            id="date"
                            name="date"
                            type="date"
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
                        />
                        <ErrorMessage
                            name="date"
                            component="div"
                            className="text-red-500 text-sm mt-1"
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Opis
                        </label>
                        <Field
                            as="textarea"
                            id="description"
                            name="description"
                            placeholder="Wprowadź opis"
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 h-20 resize-none text-black placeholder-black"
                        />
                        <ErrorMessage
                            name="description"
                            component="div"
                            className="text-red-500 text-sm mt-1"
                        />
                    </div>

                    <button
                        type="submit"
                        className={`w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-green-500 ${
                            !dirty || !isValid ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        disabled={!dirty || !isValid}
                    >
                        Dodaj
                    </button>
                </Form>
            )}
        </Formik>
    )
}
