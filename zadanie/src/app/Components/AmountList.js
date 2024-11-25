'use client';
import Amount from "@/app/Components/Amount";
import {useAmountsContext} from "@/app/providers/AmountProvider";
import {useLayoutEffect, useState} from "react";
import NotificationModal from "@/app/Components/NotificationModal";
import {theme} from "../../../tailwind.config";

export default function AmountList() {
    const [highlightedAmount, setHighlightedAmount] = useState(null);
    const {removeAmount, setSelectedAmount, setEditingAmount, filteredAmounts, notificationMessage, showNotification} = useAmountsContext();

    useLayoutEffect(() => {
        if (filteredAmounts.length > 0) {
            const latestAmount = filteredAmounts.reduce((latest, current) => {
                return new Date(current.date) > new Date(latest.date) ? current : latest;
            }, filteredAmounts[0]);
            setHighlightedAmount(latestAmount);
        }
    }, [filteredAmounts]);

    if (!filteredAmounts.length)
        return <div className={`text-center ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Brak wydatków do wyświetlenia.</div>;

    return (
        <div className={`p-4 ${theme === "dark" ? "bg-gray-900" : "bg-white"}`}>
            {showNotification && (
                <NotificationModal
                    message={notificationMessage}
                    onClose={() => setSelectedAmount(null)}
                />
            )}
            <div className="flex flex-wrap gap-4 justify-center">
                {filteredAmounts.map((amount) => (
                    <Amount
                        key={amount.id}
                        {...amount}
                        isHighlighted={highlightedAmount?.id === amount.id}
                        onRemove={removeAmount}
                        onShow={() => setSelectedAmount(amount)}
                        onEdit={() => setEditingAmount(amount)}
                    />
                ))}
            </div>
        </div>
    )
}
