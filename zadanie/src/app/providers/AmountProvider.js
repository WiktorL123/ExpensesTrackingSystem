'use client';

import { createContext, useContext, useEffect, useLayoutEffect, useState } from "react";
import { faker } from '@faker-js/faker';

const AmountsContext = createContext();

export const useAmountsContext = () => useContext(AmountsContext);

export default function AmountProvider({ children }) {
    const [amounts, setAmounts] = useState([]);
    // const [selectedCategory, setSelectedCategory] = useState("all");
    const [filters, setFilters] = useState({
        category: "all",
        minAmount: '',
        maxAmount: '',
    });
    const [selectedAmount, setSelectedAmount] = useState(null);
    const [editingAmount, setEditingAmount] = useState(null);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [showNotification, setShowNotification] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const BASE_URL = 'http://localhost:8080/expenses';



    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch(BASE_URL);
            if (!res.ok) throw new Error(res.message);
            const data = await res.json();

            const amountsWithBackendId = data.map((item) => ({
                ...item,
                id: item.id,
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
        try {
            const response = await fetch(BASE_URL, {
                method: 'POST',
                body: JSON.stringify(newAmount),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const savedAmount = await response.json()


            setAmounts((prev) => {
                if (prev.some(amount => amount.id === savedAmount.id)) {
                    console.log("Detected duplicate ID:", savedAmount.id);
                    return prev;
                }
                return [...prev, savedAmount];
            });

            setNotificationMessage("Nowy wydatek został dodany.");
        } catch (error) {
            setNotificationMessage("Wystąpił błąd podczas dodawania wydatku.");
            console.error(error);
        }
    };

    const updateAmount = async (updatedAmount) => {
        console.log("Updating amount with data:", updatedAmount);

        try {
            const response = await fetch(`${BASE_URL}/${updatedAmount.id}`, {
                method: 'PUT',
                body: JSON.stringify(updatedAmount),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const updatedData = await response.json()

            setAmounts((prev) =>
                prev.map((amount) => (amount.id === updatedData.id ? updatedData : amount))
            );

            setNotificationMessage("Wydatek został zaktualizowany.");
        } catch {
            setNotificationMessage("Błąd podczas aktualizacji wydatku.");
        }
    };

    const removeAmount = async (id) => {
        try {
            await fetch(`${BASE_URL}/${id}`, {
                method: 'DELETE',
            });
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

    const handleNewAmount = async (title, amount, category, date, description) => {
        const newAmount = {
            title,
            amount,
            category,
            date: date ? new Date(date).toISOString().split('T')[0] : undefined,
            description,
        };

        try {
            const response = await fetch(BASE_URL, {
                method: 'POST',
                body: JSON.stringify(newAmount),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const savedAmount = await response.json();

            setAmounts((prev) => [...prev, savedAmount]);

            setNotificationMessage("Nowy wydatek został dodany.");
        } catch (error) {
            setNotificationMessage("Wystąpił błąd podczas dodawania wydatku.");
            console.error(error);
        }
    };

    const handleBackdropClick = (event) => {
        if (event.target === event.currentTarget) {
            setSelectedAmount(null);
        }
    };

    const categories = [...new Set(amounts.map((item) => item.category))];
    const filteredAmounts = amounts.filter(amount => {
        const matchesCategory = filters.category === 'all' || amount.category === filters.category;
        const matchesMaxAmount = !filters.maxAmount || amount.amount <= parseFloat(filters.maxAmount);
        const matchesMinAmount = !filters.minAmount || amount.amount >= parseFloat(filters.minAmount);

        return matchesCategory && matchesMaxAmount && matchesMinAmount;
    });

    const updateFilter = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };


    return (
        <AmountsContext.Provider
            value={{
                filteredAmounts,
                categories,
                amounts,
                selectedAmount,
                editingAmount,
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
                updateFilter,
                filters,
                setFilters
            }}
        >
            {children}
        </AmountsContext.Provider>
    );
}
