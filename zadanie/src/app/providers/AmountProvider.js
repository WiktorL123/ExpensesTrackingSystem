'use client';

import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useState } from 'react';

const AmountsContext = createContext();

export const useAmountsContext = () => useContext(AmountsContext);

export default function AmountProvider({ children }) {
    const [amounts, setAmounts] = useState([]);
    const [filters, setFilters] = useState({
        category: 'all',
        minAmount: '',
        maxAmount: '',
    });
    const [selectedAmount, setSelectedAmount] = useState(null);
    const [editingAmount, setEditingAmount] = useState(null);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [showNotification, setShowNotification] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [amountAction, setAmountAction] = useState(false);

    const BASE_URL = 'http://localhost:8080/expenses';

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(BASE_URL);
            if (!res.ok) throw new Error('Failed to fetch expenses');
            const data = await res.json();
            const amountsWithBackendId = data.map((item) => ({ ...item, id: item.id }));
            setAmounts(amountsWithBackendId);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        console.log('render2')
        fetchData();
    }, [fetchData, amountAction]);

    useEffect(() => {
        console.log('render2')
        localStorage.setItem('amounts', JSON.stringify(amounts));
    }, [amounts]);

    useLayoutEffect(() => {
        console.log('render3')
        if (notificationMessage) {
            setShowNotification(true);
            const timer = setTimeout(() => {
                setShowNotification(false);
                setNotificationMessage('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [notificationMessage]);

    const addAmount = useCallback(async (newAmount) => {
        console.log('sending: ', newAmount)
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(BASE_URL, {
                method: 'POST',
                body: JSON.stringify(newAmount),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) throw new Error('Failed to add amount');

            const savedAmount = await response.json();
            setAmounts((prev) => [...prev.filter((amount) => amount.id !== savedAmount.id), savedAmount]);
            setNotificationMessage('Nowy wydatek został dodany.');
        } catch (err) {
            setError(err.message);
            setNotificationMessage('Wystąpił błąd podczas dodawania wydatku.');
        } finally {
            setLoading(false);
            setAmountAction((prev) => !prev);
        }
    }, []);

    const updateAmount = useCallback(async (updatedAmount) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${BASE_URL}/${updatedAmount.id}`, {
                method: 'PUT',
                body: JSON.stringify(updatedAmount),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) throw new Error('Failed to update amount');

            const updatedData = await response.json();
            setAmounts((prev) =>
                prev.map((amount) => (amount.id === updatedData.id ? updatedData : amount))
            );
            setNotificationMessage('Wydatek został zaktualizowany.');
        } catch (err) {
            setError(err.message);
            setNotificationMessage('Błąd podczas aktualizacji wydatku.');
        } finally {
            setLoading(false);
            setAmountAction((prev) => !prev);
        }
    }, []);

    const removeAmount = useCallback(async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${BASE_URL}/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete amount');

            setAmounts((prev) => prev.filter((amount) => amount.id !== id));
            setNotificationMessage('Wydatek został usunięty.');
        } catch (err) {
            setError(err.message);
            setNotificationMessage('Wystąpił błąd podczas usuwania wydatku.');
        } finally {
            setLoading(false);
        }
    }, []);

    const handleSaveEdit = (updatedAmount) => {
        const formattedAmount = {
            ...updatedAmount,
            date: updatedAmount.date
                ? (typeof updatedAmount.date === 'string'
                    ? updatedAmount.date
                    : new Date(updatedAmount.date).toISOString().substring(0, 10))
                : '',
        };
        updateAmount(formattedAmount);
        setEditingAmount(null);
    };

    const handleCancelEdit = () => setEditingAmount(null);

    const handleBackdropClick = (event) => {
        if (event.target === event.currentTarget) {
            setSelectedAmount(null);
        }
    };

    const categories = [...new Set(amounts.map((item) => item.category))];
    const filteredAmounts = amounts.filter((amount) => {
        const matchesCategory = filters.category === 'all' || amount.category === filters.category;
        const matchesMaxAmount = !filters.maxAmount || amount.amount <= parseFloat(filters.maxAmount);
        const matchesMinAmount = !filters.minAmount || amount.amount >= parseFloat(filters.minAmount);

        return matchesCategory && matchesMaxAmount && matchesMinAmount;
    });

    const updateFilter = (key, value) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
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
                handleNewAmount: addAmount,
                removeAmount,
                updateAmount,
                handleSaveEdit,
                handleCancelEdit,
                notificationMessage,
                showNotification,
                loading,
                error,
                updateFilter,
                filters,
                setFilters,
            }}
        >
            {children}
        </AmountsContext.Provider>
    );
}
