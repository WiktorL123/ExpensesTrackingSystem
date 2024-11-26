'use client';

import { createContext, useContext, useEffect, useLayoutEffect, useState } from "react";
import { v4 } from "uuid";
import { useFetchData } from "@/app/Hooks/useFetchData";
import { useApiActions } from "@/app/Hooks/useApiActions";

const AmountsContext = createContext();

export const useAmountsContext = () => useContext(AmountsContext);

export default function AmountProvider({ children }) {
    const [amounts, setAmounts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedAmount, setSelectedAmount] = useState(null);
    const [editingAmount, setEditingAmount] = useState(null);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [showNotification, setShowNotification] = useState(false);

    // Fetch data hook
    const { data, error, loading, refetch } = useFetchData('http://localhost:3000/expenses');

    // API actions hooks
    const { performAction: addAmountAction } = useApiActions('http://localhost:3000/expenses', {
        method: 'POST',
    });
    const { performAction: editAmountAction } = useApiActions(null);
    const { performAction: removeAmountAction } = useApiActions(null);

    // Synchronize fetched data
    useEffect(() => {
        if (data) setAmounts(data);
    }, [data]);

    useEffect(() => {
        localStorage.setItem('amounts', JSON.stringify(amounts));
    }, [amounts]);

    useLayoutEffect(() => {
        if (notificationMessage) {
            setShowNotification(true);
            const timer = setTimeout(() => {
                setShowNotification(false);
                setNotificationMessage('');
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [notificationMessage]);

    const addAmount = async (newAmount) => {
        try {
            const response = await addAmountAction(newAmount);
            setAmounts((prev) => [...prev, response]);
            setNotificationMessage("Nowy wydatek został dodany.");
        } catch {
            setNotificationMessage("Wystąpił błąd podczas dodawania wydatku.");
        }
    };

    const updateAmount = async (updatedAmount) => {
        const formattedAmount = {
            ...updatedAmount,
            date: updatedAmount.date
                ? new Date(updatedAmount.date).toISOString().split('T')[0]
                : undefined,
        };

        try {
            const response = await editAmountAction(`http://localhost:3000/expenses/${updatedAmount.id}`, {
                method: 'PUT',
                body: JSON.stringify(formattedAmount),
            });
            setAmounts((prev) =>
                prev.map((amount) => (amount.id === response.id ? response : amount))
            );
            setNotificationMessage("Wydatek został zaktualizowany.");
        } catch {
            setNotificationMessage("Błąd podczas aktualizacji wydatku.");
        }
    };

    const removeAmount = async (id) => {
        try {
            await removeAmountAction(`http://localhost:3000/expenses/${id}`, { method: 'DELETE' });
            setAmounts((prev) => prev.filter((amount) => amount.id !== id));
            setNotificationMessage("Wydatek został usunięty.");
        } catch {
            setNotificationMessage("Wystąpił błąd podczas usuwania wydatku.");
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
            date: date ? new Date(date).toISOString().split('T')[0] : undefined,
            description,
        };
        addAmount(newAmount);
    };

    const handleBackdropClick = (event) => {
        if (event.target === event.currentTarget) {
            setSelectedAmount(null);
        }
    };

    const categories = [...new Set(amounts.map((item) => item.category))];
    const filteredAmounts = selectedCategory === "all"
        ? amounts
        : amounts.filter((item) => item.category === selectedCategory);

    return (
        <AmountsContext.Provider
            value={{
                filteredAmounts,
                categories,
                amounts,
                selectedCategory,
                selectedAmount,
                editingAmount,
                setSelectedCategory,
                setSelectedAmount,
                setEditingAmount,
                handleBackdropClick,
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
            }}
        >
            {children}
        </AmountsContext.Provider>
    );
}
