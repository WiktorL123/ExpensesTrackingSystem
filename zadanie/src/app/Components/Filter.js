'use client';
import React from 'react';
import {useAmountsContext} from "@/app/providers/AmountProvider";

export default function Filter({categories}) {
    const {  selectedCategory, setSelectedCategory } = useAmountsContext()
    return (
        <div>
            <label style={labelStyle} htmlFor="category-filter">Filtruj według kategorii:</label>
            <select
                id="category-filter"
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
            >
                <option value="">Wszystkie</option>
                {categories.map((category, index) => (
                    <option key={index} value={category}>
                        {category}
                    </option>
                ))}
            </select>
        </div>
    );
}
const labelStyle = {
    
}
