'use client';

import { createContext, useContext, useEffect, useLayoutEffect, useState } from "react";
import { v4 } from "uuid";

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
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { performAction: addAmountAction } = useApiActions('http://localhost:8080');
    const { performAction: editAmountAction } = useApiActions('http://localhost:8080');
    const { performAction: removeAmountAction } = useApiActions('http://localhost:8080');

    const BASE_URL = 'http://localhost:8080/expenses';

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch(BASE_URL);
            if (!res.ok) throw new Error(res.message);
            const data = await res.json();

            // Przechowywanie danych z prawdziwymi ID
            const amountsWithBackendId = data.map((item) => ({
                ...item,
                id: item.id,  // ID z backendu
            }));
            setAmounts(amountsWithBackendId);
        } catch (error) {
            setError(error);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
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
        console.log('Dodawanie nowego wydatku:', newAmount);
        console.log('Aktualna lista wydatków:', amounts);
        try {
            const response = await addAmountAction('/expenses', {
                method: 'POST',
                body: newAmount,
            });
            setAmounts((prev) => {
                if (prev.some(amount => amount.id === newAmount.id)) {
                    console.log("Detected duplicate ID:", newAmount.id);
                    return prev;
                }
                return [...prev, response];  // Użyj odpowiedzi z backendu, aby uzyskać prawdziwe ID
            });
            setNotificationMessage("Nowy wydatek został dodany.");
        } catch {
            setNotificationMessage("Wystąpił błąd podczas dodawania wydatku.");
        }
    };

    const updateAmount = async (updatedAmount) => {
        console.log("Updating amount with data:", updatedAmount);

        try {
            // Wysyłamy prawdziwe ID do backendu
            const response = await editAmountAction(`/expenses/${updatedAmount.id}`, {
                method: 'PUT',
                body: updatedAmount,
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
            await removeAmountAction(`/expenses/${id}`, { method: 'DELETE' });
            setAmounts((prev) => prev.filter((amount) => amount.id !== id));
            setNotificationMessage("Wydatek został usunięty.");
        } catch {
            setNotificationMessage("Wystąpił błąd podczas usuwania wydatku.");
        }
    };

    const handleSaveEdit = (updatedAmount) => {
        const formattedAmount = {
            ...updatedAmount,
            date: updatedAmount.date
                ? (typeof updatedAmount.date === "string"
                    ? updatedAmount.date
                    : new Date(updatedAmount.date).toISOString().substring(0, 10))
                : "",
        };
        updateAmount(formattedAmount);  // Używamy prawdziwego ID w tej funkcji
        setEditingAmount(null);
    };

    const handleCancelEdit = () => setEditingAmount(null);

    const handleNewAmount = (title, amount, category, date, description) => {
        const newAmount = {
            id: v4(),  // Generowanie UUID tylko do UI
            title,
            amount,
            category,
            date: date ? new Date(date).toISOString().split('T')[0] : undefined,
            description,
        };
        console.log("Generated ID for UI: ", newAmount.id);
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
