'use client';
import  {useAmountsContext} from "@/app/providers/AmountProvider";
import AmountList from './Components/AmountList';
import Filter from './Components/Filter';
import AddAmountForm from './Components/AddAmountForm';
import Modal from './Components/Modal';
import EditAmountForm from './Components/EditAmountForm';
import {v4} from "uuid";

export default function Home() {
    const {
        amounts,
        selectedCategory,
        selectedAmount,
        editingAmount,
        setSelectedCategory,
        setSelectedAmount,
        setEditingAmount,
        addAmount,
        removeAmount,
        updateAmount
    } = useAmountsContext();

    const categories = [...new Set(amounts.map(item => item.category))];

    const filteredAmounts = selectedCategory
        ? amounts.filter(item => item.category === selectedCategory)
        : amounts;

    const handleEdit = (amount) => setEditingAmount(amount);

    const handleSaveEdit = (updatedAmount) => {
        updateAmount(updatedAmount);
        setEditingAmount(null);
    };

    const handleCancelEdit = () => setEditingAmount(null);

    return (
        <div>
            <AddAmountForm
                categories={categories}
                onNewAmount={(title, amount, category, date, description) => {
                    addAmount({
                        id: v4(),
                        title,
                        amount,
                        category,
                        date: new Date(date),
                        description
                    });
                }}
            />
            <Filter
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
            />
            <AmountList
                amounts={filteredAmounts}
                onRemoveAmount={removeAmount}
                onShowDetails={setSelectedAmount}
                onEditAmount={handleEdit}
            />
            {selectedAmount && (
                <Modal onClose={() => setSelectedAmount(null)}>
                    <h1>{selectedAmount.title}</h1>
                    <p>{selectedAmount.description}</p>
                </Modal>
            )}
            {editingAmount && (
                <EditAmountForm
                    amount={editingAmount}
                    onSave={handleSaveEdit}
                    onCancel={handleCancelEdit}
                />
            )}
        </div>
    );
}
