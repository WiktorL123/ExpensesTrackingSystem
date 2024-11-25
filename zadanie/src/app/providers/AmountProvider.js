'use client';

import { createContext, useContext, useEffect, useLayoutEffect, useState } from "react";
import { v4 } from "uuid";

const AmountsContext = createContext();

export const useAmountsContext = () => useContext(AmountsContext);

export default function AmountProvider({ children }) {
    const [amounts, setAmounts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedAmount, setSelectedAmount] = useState(null);
    const [editingAmount, setEditingAmount] = useState(null);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [showNotification, setShowNotification] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    useEffect(() => {
        const fetchAmounts = async () => {
            setLoading(true);
            try {
                const res = await fetch('http://localhost:8080/expenses');
                if (!res.ok) throw new Error('Błąd ładowania danych');
                const data = await res.json();
                setAmounts(data);
            } catch (err) {
                setError(err.message || "Wystąpił błąd podczas ładowania danych.");
            } finally {
                setLoading(false);
            }
        };
        fetchAmounts();
    }, []);


    useEffect(() => {
        localStorage.setItem('amounts', JSON.stringify(amounts));
    }, [amounts]);


    useLayoutEffect(() => {
        if (notificationMessage) {
            setShowNotification(true);
            const timer = setTimeout(() => {
                setShowNotification(false);
                setNotificationMessage('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [notificationMessage]);

    const addAmount = async (newAmount) => {
        try {
            const res = await fetch('http://localhost:8080/expenses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newAmount),
            });
            if (!res.ok) throw new Error('Błąd podczas dodawania wydatku');
            const createdAmount = await res.json();
            setAmounts([...amounts, createdAmount]);
            setNotificationMessage("Nowy wydatek został dodany.");
        } catch (err) {
            setError(err.message || "Wystąpił błąd podczas dodawania wydatku.");
        }
    };

    const updateAmount = async (updatedAmount) => {
        try {
            const res = await fetch(`http://localhost:8080/expenses/${updatedAmount.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedAmount),
            });
            if (!res.ok) throw new Error('Błąd podczas edycji wydatku');
            const data = await res.json();
            setAmounts(amounts.map(amount => (amount.id === data.id ? data : amount)));
            setNotificationMessage("Wydatek został zaktualizowany.");
        } catch (err) {
            setError(err.message || "Wystąpił błąd podczas edycji wydatku.");
        }
    };

    const removeAmount = async (id) => {
        try {
            const res = await fetch(`http://localhost:8080/expenses/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Błąd podczas usuwania wydatku');
            setAmounts(amounts.filter(amount => amount.id !== id));
            setNotificationMessage("Wydatek został usunięty.");
        } catch (err) {
            setError(err.message || "Wystąpił błąd podczas usuwania wydatku.");
        }
    };

    const handleSaveEdit = (updatedAmount) => {
        updateAmount(updatedAmount);
        setEditingAmount(null);
    };

    const handleCancelEdit = () => setEditingAmount(null);

    const handleNewAmount = (title, amount, category, date, description) => {
        const newAmount = {
            id: v4(),
            title,
            amount,
            category,
            date: new Date(date),
            description,
        };
        addAmount(newAmount);
    };

    const categories = [...new Set(amounts.map(item => item.category))];
    const filteredAmounts = selectedCategory === "all"
        ? amounts
        : amounts.filter(item => item.category === selectedCategory);

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
            showNotification,
            loading,
            error,
        }}>
            {children}
        </AmountsContext.Provider>
    );
}
