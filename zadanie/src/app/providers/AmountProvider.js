'use client'


import { createContext, useContext, useState } from "react";
import amountData from '../data/data.json';


const AmountsContext = createContext();


export const useAmountsContext = () => useContext(AmountsContext);


export default function AmountProvider({ children }) {
    const [amounts, setAmounts] = useState(amountData);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedAmount, setSelectedAmount] = useState(null);
    const [editingAmount, setEditingAmount] = useState(null);

    const addAmount = (newAmount) => setAmounts([...amounts, newAmount]);

    const removeAmount = (id) => setAmounts(amounts.filter(amount => amount.id !== id));

    const updateAmount = (updatedAmount) =>
        setAmounts(amounts.map(amount => amount.id === updatedAmount.id ? updatedAmount : amount));

    return (
        <AmountsContext.Provider value={{
            amounts,
            selectedCategory,
            selectedAmount,
            editingAmount,
            setSelectedCategory,
            setSelectedAmount,
            setEditingAmount,
            addAmount,
            removeAmount,
            updateAmount,
        }}>
            {children}
        </AmountsContext.Provider>
    );
}
