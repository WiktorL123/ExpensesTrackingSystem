'use client';

import {createContext, useContext, useEffect, useLayoutEffect, useState} from "react";

import {v4} from "uuid";

const AmountsContext = createContext();

export const useAmountsContext = () => useContext(AmountsContext);

export default function AmountProvider({ children }) {


    const [amounts, setAmounts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedAmount, setSelectedAmount] = useState(null);
    const [editingAmount, setEditingAmount] = useState(null);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [showNotification, setShowNotification] = useState(false);
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

    useLayoutEffect(() => {
        if (notificationMessage){
            setShowNotification(true)
            const timer = setTimeout(() => {
                setShowNotification(false)
                setNotificationMessage('')
            }, 3000)
            return ()=>clearTimeout(timer)
        }

    }, [notificationMessage]);


    const categories = [...new Set(amounts.map(item => item.category))];

    const filteredAmounts = selectedCategory === "all"
        ? amounts
        : amounts.filter(item => item.category === selectedCategory);
    const addAmount = (newAmount) => {
        setAmounts([...amounts, newAmount]);
        setNotificationMessage("Nowy wydatek został dodany.");
    };

    const removeAmount = (id) => {
        setAmounts(amounts.filter(amount => amount.id !== id));
        setNotificationMessage("Wydatk został usunięty.");
    };


    const updateAmount = (updatedAmount) => {
        setAmounts(amounts.map(amount => amount.id === updatedAmount.id ? updatedAmount : amount));
        setNotificationMessage("Wydatk został edytowany.");
    };

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
            handleNewAmount,
            notificationMessage,
            showNotification
        }}>
            {children}
        </AmountsContext.Provider>
    );
}
