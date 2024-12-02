import { FixedSizeList as List } from "react-window";
import { useAmountsContext } from "@/app/providers/AmountProvider";
import { useEffect, useState } from "react";
import NotificationModal from "@/app/Components/NotificationModal";
import { theme } from "../../../tailwind.config";
import Amount from "@/app/Components/Amount";
import Pagination from "@/app/Components/Pagination";

export default function AmountList() {
    const [highlightedAmount, setHighlightedAmount] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const itemHeight = 160;
    const gap = 16;
    const {
        removeAmount,
        setSelectedAmount,
        setEditingAmount,
        filteredAmounts,
        notificationMessage,
        showNotification,
    } = useAmountsContext();

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentAmounts = filteredAmounts.slice(startIndex, endIndex);


    useEffect(() => {
        console.log(filteredAmounts)
        if (filteredAmounts.length > 0) {
            const latestAmount = filteredAmounts.reduce((latest, current) => {
                return new Date(current.date) > new Date(latest.date) ? current : latest;
            }, filteredAmounts[0]);
            setHighlightedAmount(latestAmount);
        }
    }, [filteredAmounts]);


    const handleShowAmount = (amount) => {
        setSelectedAmount(amount);
    }

    const handleEditAmount = (amount) => {
        setEditingAmount(amount);
    };

    const renderRow = ({ index, style }) => {
        const start = index * 3;
        const end = start + 3;
        const rowItems = currentAmounts.slice(start, end);
        filteredAmounts.forEach((currentAmount) => {console.log('id', currentAmount.id)})
        return (
            <div
                style={{ ...style, display: "flex", gap: `${gap}px`, justifyContent: "center" }}
                key={`row-${index}`}
            >
                {rowItems.map((amount) => (

                    <Amount
                        key={amount.id}
                        {...amount}
                        isHighlighted={highlightedAmount?.id === amount.id}
                        onRemove={removeAmount}
                        onShow={() => handleShowAmount(amount)}
                        onEdit={() => handleEditAmount(amount)}
                    />
                ))}
            </div>
        );
    };


    const rowCount = Math.ceil(currentAmounts.length / 3);


    if (!filteredAmounts.length)
        return (
            <div
                className={`text-center ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
            >
                Brak wydatków do wyświetlenia.
            </div>
        );

    return (
        <div className={`p-4 ${theme === "dark" ? "bg-gray-900" : "bg-white"}`}>
            {showNotification && (
                <NotificationModal
                    message={notificationMessage}
                    onClose={() => setSelectedAmount(null)}
                />
            )}


            <div className="flex flex-col items-center">
                <List
                    height={400}
                    itemCount={rowCount}
                    itemSize={itemHeight + gap}
                    width="100%"
                >
                    {renderRow}
                </List>


                <Pagination
                    totalItems={filteredAmounts.length}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                />
            </div>
        </div>
    );
}
