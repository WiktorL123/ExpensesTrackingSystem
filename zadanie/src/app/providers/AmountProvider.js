'use client';

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useLayoutEffect,
    useState,
    useMemo,
} from 'react';

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
    const [amountAction, triggerAmountAction] = useState(false);

    const BASE_URL = 'http://localhost:8080/expenses';

    const filteredAmounts = useMemo(() => {
        const result = amounts.filter((amount) => {
            const matchesCategory = filters.category === 'all' || amount.category === filters.category;
            const matchesMaxAmount = !filters.maxAmount || amount.amount <= parseFloat(filters.maxAmount);
            const matchesMinAmount = !filters.minAmount || amount.amount >= parseFloat(filters.minAmount);
            return matchesCategory && matchesMaxAmount && matchesMinAmount;
        });
        console.log('[filteredAmounts] Filtered amounts:', result);
        return result;
    }, [amounts, filters]);

    const fetchData = useCallback(async () => {
        console.log('[fetchData] Start fetching data');
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(BASE_URL);
            if (!response.ok) throw new Error('Failed to fetch expenses');
            const data = await response.json();
            setAmounts(data);
            console.log('[fetchData] Data fetched:', data);
        } catch (err) {
            console.error('[fetchData] Error:', err.message);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        console.log('[useEffect] fetchData triggered');
        fetchData();
    }, [fetchData, amountAction]);

    useEffect(() => {
        if (JSON.stringify(filteredAmounts) !== localStorage.getItem("filteredAmounts")) {
            console.log("[useEffect] Updating localStorage");
            localStorage.setItem("filteredAmounts", JSON.stringify(filteredAmounts));
        }
    }, [filteredAmounts]);


    useLayoutEffect(() => {
        if (notificationMessage) {
            console.log('[useLayoutEffect] Notification message set:', notificationMessage);
            setShowNotification(true);
            const timer = setTimeout(() => {
                setShowNotification(false);
                setNotificationMessage('');
                console.log('[useLayoutEffect] Notification cleared');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [notificationMessage]);

    const addAmount = useCallback(async (newAmount) => {
        console.log('[addAmount] Adding amount:', newAmount);
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(BASE_URL, {
                method: 'POST',
                body: JSON.stringify(newAmount),
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok) throw new Error('Failed to add amount');
            const savedAmount = await response.json();
            setAmounts((prev) => [...prev, savedAmount]);
            console.log('[addAmount] Amount added:', savedAmount);
            setNotificationMessage('Nowy wydatek został dodany.');
        } catch (err) {
            console.error('[addAmount] Error:', err.message);
            setError(err.message);
            setNotificationMessage('Wystąpił błąd podczas dodawania wydatku.');
        } finally {
            setLoading(false);
            triggerAmountAction((prev) => !prev);
        }
    }, []);

    const updateAmount = useCallback(async (updatedAmount) => {
        console.log('[updateAmount] Updating amount:', updatedAmount);
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${BASE_URL}/${updatedAmount.id}`, {
                method: 'PUT',
                body: JSON.stringify(updatedAmount),
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok) throw new Error('Failed to update amount');
            const updatedData = await response.json();
            setAmounts((prev) =>
                prev.map((amount) => (amount.id === updatedData.id ? updatedData : amount))
            );
            console.log('[updateAmount] Amount updated:', updatedData);
            setNotificationMessage('Wydatek został zaktualizowany.');
        } catch (err) {
            console.error('[updateAmount] Error:', err.message);
            setError(err.message);
            setNotificationMessage('Błąd podczas aktualizacji wydatku.');
        } finally {
            setLoading(false);
            triggerAmountAction((prev) => !prev);
        }
    }, []);

    const removeAmount = useCallback(async (id) => {
        console.log('[removeAmount] Removing amount with ID:', id);
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete amount');
            setAmounts((prev) => prev.filter((amount) => amount.id !== id));
            console.log('[removeAmount] Amount removed:', id);
            setNotificationMessage('Wydatek został usunięty.');
        } catch (err) {
            console.error('[removeAmount] Error:', err.message);
            setError(err.message);
            setNotificationMessage('Wystąpił błąd podczas usuwania wydatku.');
        } finally {
            setLoading(false);
        }
    }, []);

    const handleSaveEdit = useCallback((updatedAmount) => {
        console.log('[handleSaveEdit] Saving edited amount:', updatedAmount);
        updateAmount({
            ...updatedAmount,
            date: updatedAmount.date
                ? new Date(updatedAmount.date).toISOString().split('T')[0]
                : '',
        });
        setEditingAmount(null);
    }, [updateAmount]);

    const handleCancelEdit = useCallback(() => {
        console.log('[handleCancelEdit] Edit cancelled');
        setEditingAmount(null);
    }, []);

    const handleBackdropClick = useCallback(
        (event) => {
            if (event.target === event.currentTarget) {
                console.log('[handleBackdropClick] Backdrop clicked, clearing selection');
                setSelectedAmount(null);
            }
        },
        []
    );

    const categories = useMemo(() => {
        const result = [...new Set(amounts.map((item) => item.category))];
        console.log('[categories] Calculated categories:', result);
        return result;
    }, [amounts]);



    const updateFilter = useCallback((key, value) => {
        console.log('[updateFilter] Updating filter:', { key, value });
        setFilters((prev) => ({ ...prev, [key]: value }));
    }, []);

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
