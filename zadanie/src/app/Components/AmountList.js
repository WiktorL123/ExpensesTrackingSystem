import { useAmountsContext } from "@/app/providers/AmountProvider";
import { useEffect, useMemo, useState } from "react";
import NotificationModal from "@/app/Components/NotificationModal";
import { theme } from "../../../tailwind.config";
import Amount from "@/app/Components/Amount";
import Pagination from "@/app/Components/Pagination";

export default function AmountList() {
    console.log("[AmountList] Render start");

    const [highlightedAmount, setHighlightedAmount] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

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

    const currentAmounts = useMemo(() => {
        const sliced = filteredAmounts.slice(startIndex, endIndex);
        console.log("[currentAmounts] Sliced amounts:", sliced);
        return sliced;
    }, [filteredAmounts, startIndex, endIndex]);

    useEffect(() => {
        if (filteredAmounts.length > 0) {
            console.log("[useEffect] Checking for highlighted amount");
            const latestAmount = filteredAmounts.reduce((latest, current) => {
                return new Date(current.date) > new Date(latest.date) ? current : latest;
            }, filteredAmounts[0]);

            if (highlightedAmount?.id !== latestAmount.id) {
                setHighlightedAmount(latestAmount);
                console.log("[useEffect] Highlighted amount set to:", latestAmount);
            }
        } else {
            console.log("[useEffect] No amounts to highlight");
            setHighlightedAmount(null);
        }
    }, [filteredAmounts, highlightedAmount]);

    const handleShowAmount = (amount) => {
        console.log("[handleShowAmount] Showing amount:", amount);
        setSelectedAmount(amount);
    };

    const handleEditAmount = (amount) => {
        console.log("[handleEditAmount] Editing amount:", amount);
        setEditingAmount(amount);
    };

    const handleCloseNotification = () => {
        console.log("[handleCloseNotification] Closing notification");
        setSelectedAmount(null);
    };

    if (!filteredAmounts.length) {
        console.log("[AmountList] No filtered amounts to display");
        return (
            <div
                className={`text-center ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
            >
                Brak wydatków do wyświetlenia.
            </div>
        );
    }

    console.log("[AmountList] Render complete");

    return (
        <div className={`p-4 ${theme === "dark" ? "bg-gray-900" : "bg-white"}`}>
            {showNotification && (
                <NotificationModal message={notificationMessage} onClose={handleCloseNotification} />
            )}

            <div className="flex flex-col items-center">
                <div className="grid grid-cols-1 gap-4 w-full">
                    {currentAmounts.map((amount) => (
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

                <Pagination
                    totalItems={filteredAmounts.length}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={(page) => {
                        console.log("[Pagination] Page changed to:", page);
                        setCurrentPage(page);
                    }}
                />
            </div>
        </div>
    );
}
