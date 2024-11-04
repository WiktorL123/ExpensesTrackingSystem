// Home.js
'use client';
import amountData from './data/data.json';
import { useState } from 'react';
import AmountList from './Components/AmountList';
import Filter from './Components/Filter';
import AddAmountForm from './Components/AddAmountForm';
import { v4 } from 'uuid';
import Modal from './Components/Modal'

export default function Home() {
    const [amounts, setAmounts] = useState(amountData);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedAmount, setSelectedAmount] = useState(null)

    const categories = [...new Set(amounts.map(item => item.category))];

    const filteredAmounts = selectedCategory
        ? amounts.filter(item => item.category === selectedCategory)
        : amounts;

    return (
        <div>
            <AddAmountForm
                categories = {categories}
                onNewAmount={(title, amount, category, date, description) => {
                    const newAmount = [
                        ...amounts,
                        {
                            id: v4(),
                            title,
                            amount,
                            category,
                            date,
                            description
                        }
                    ];
                    setAmounts(newAmount);
                }}
            />
            <Filter
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
            />
            <AmountList
                amounts={filteredAmounts}
                onRemoveAmount={id => {
                    const newAmounts = amounts.filter(amount => amount.id !== id);
                    setAmounts(newAmounts);
                }}
                onShowDetails={setSelectedAmount}
            />

            {selectedAmount && (
                <Modal onClose={()=>setSelectedAmount(null)
                }>
                   <h1>{selectedAmount.title}</h1>
                    <p>{selectedAmount.description}</p>

                </Modal>
            )}

        </div>
    );
}
