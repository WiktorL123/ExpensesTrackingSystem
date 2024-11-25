//aaaa
//bbbb

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
    date: Yup.date().min(new Date, 'data nie moze byc wczesniejsza')
        .typeError('NIEPRAWIDŁOWA DATA')
        .required('Data wymagana!'),
    description: Yup.string().min(10, 'Opis jest za krótki')
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
    const {handleNewAmount, categories} = useAmountsContext()

    const handleSubmit = (values, { resetForm }) => {
        handleNewAmount(
            values.title,
            values.amount,
            values.category,
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
                <Form>
                    <div>
                        <Field className="input" name="title" type="text" placeholder="Podaj tytuł" />
                        <ErrorMessage name="title" component="div" className="error" />
                    </div>
                    <div>
                        <Field className="input" name="amount" type="number" placeholder="Podaj wydatek" />
                        <ErrorMessage name="amount" component="div" className="error" />
                    </div>
                    {/*<Field as={"select"} name={"category"}>*/}
                    {/*    <option value='' label={'wybierz kategoryje'}></option>*/}
                    {/*    {categories.map((cat, index)=>{*/}
                    {/*        return (*/}
                    {/*            <option key={index} value={cat}>{cat}</option>*/}
                    {/*        )*/}
                    {/*    })}*/}

                    {/*</Field>*/}
                    <Field className ='input' name = "category" type="text" placeholder ="kategoria"></Field>
                    <ErrorMessage name={'category'} component={'div'} className={'error'}/>

                    <div>
                        <Field className="input accent-amber-50" name="date" type="date"/>
                        <ErrorMessage name="date" component="div" className="error" />
                    </div>

                    <div>
                        <Field as={'textarea'} placeholder={'opis'} name={'description'}></Field>
                        <ErrorMessage name={'description'} component={'div'} className={'error'}/>
                    </div>
                    <button
                        className="button"
                        type="submit"
                        disabled={!dirty || !isValid}
                    >
                        Dodaj
                    </button>
                </Form>
            )}

        </Formik>
    );
}
