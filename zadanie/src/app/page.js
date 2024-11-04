// Home.js
'use client';
import amountData from './data/data.json';
import { useState } from 'react';
import AmountList from './Components/AmountList';
import Filter from './Components/Filter';
import AddAmountForm from './Components/AddAmountForm';
import { v4 } from 'uuid';

export default function Home() {
    const [amounts, setAmounts] = useState(amountData);
    const [selectedCategory, setSelectedCategory] = useState("");

    const categories = [...new Set(amounts.map(item => item.category))];

    const filteredAmounts = selectedCategory
        ? amounts.filter(item => item.category === selectedCategory)
        : amounts;

    return (
        <div>
            <AddAmountForm
                categories = {categories}
                onNewAmount={(title, amount, category, date) => {
                    const newAmount = [
                        ...amounts,
                        {
                            id: v4(),
                            title,
                            amount,
                            category,
                            date
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
            />
        </div>
    );
}
