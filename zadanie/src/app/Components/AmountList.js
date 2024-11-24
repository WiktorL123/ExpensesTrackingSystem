'use client';
import Amount from "@/app/Components/Amount";
import {useAmountsContext} from "@/app/providers/AmountProvider";
import {useLayoutEffect, useState} from "react";
import NotificationModal from "@/app/Components/NotificationModal";
export default function AmountList() {
    const [highlightedAmount, setHighlightedAmount] = useState(null);
   const {removeAmount, setSelectedAmount, setEditingAmount, filteredAmounts, selectedAmount, notificationMessage, showNotification} = useAmountsContext()

    useLayoutEffect(() => {
        if (filteredAmounts.length > 0) {

            const latestAmount = filteredAmounts.reduce((latest, current) => {
                return new Date(current.date) > new Date(latest.date) ? current : latest;
            }, filteredAmounts[0]);
            setHighlightedAmount(latestAmount);
        }
    }, [filteredAmounts]);



    if (!filteredAmounts.length) return <div>No amounts here!</div>

    return (
        <div>
            {showNotification && <NotificationModal message={notificationMessage} onClose={()=>setSelectedAmount(null)} /> }
            {filteredAmounts.map(amount => <Amount
                key={amount.id}
                {...amount}
                isHighlighted= {highlightedAmount?.id === amount.id}
                onRemove={removeAmount}
                onShow = {()=>setSelectedAmount(amount)}
                onEdit={()=>setEditingAmount(amount)}

                />
            )}
        </div>
    )

}