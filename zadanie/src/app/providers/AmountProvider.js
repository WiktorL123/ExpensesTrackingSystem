'use client';

import {createContext, useContext, useEffect, useState} from "react";

import {v4} from "uuid";

const AmountsContext = createContext();

export const useAmountsContext = () => useContext(AmountsContext);

export default function AmountProvider({ children }) {


    const [amounts, setAmounts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedAmount, setSelectedAmount] = useState(null);
    const [editingAmount, setEditingAmount] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            const data = await import('../data/data.json')
            return data.default
        }
        loadData()
            .then(data=>{
                setAmounts(data)
            })
            .catch(err=>{
                console.log(err)
                setAmounts('błąd')
            })
    }, []);

    const categories = [...new Set(amounts.map(item => item.category))];

    const filteredAmounts = selectedCategory === "all"
        ? amounts
        : amounts.filter(item => item.category === selectedCategory);
    const addAmount = (newAmount) => setAmounts([...amounts, newAmount]);

    const removeAmount = (id) => setAmounts(amounts.filter(amount => amount.id !== id));

    const updateAmount = (updatedAmount) =>
        setAmounts(amounts.map(amount => amount.id === updatedAmount.id ? updatedAmount : amount));
    const handleSaveEdit = (updatedAmount) => {
        updateAmount(updatedAmount);
        setEditingAmount(null);
    };

    const handleCancelEdit = () => setEditingAmount(null);
    const handleNewAmount = (title, amount, category, date, description) => {
        addAmount({
            id: v4(),
            title,
            amount,
            category,
            date: new Date(date),
            description
        });

    }

    return (
        <AmountsContext.Provider value={{
            filteredAmounts,
            categories,
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
            handleSaveEdit,
            handleCancelEdit,
            handleNewAmount
        }}>
            {children}
        </AmountsContext.Provider>
    );
}
