'use client';
import React from 'react';
import { useAmountsContext } from "@/app/providers/AmountProvider";



export default function Filter() {
    const {updateFilter, filters, categories} = useAmountsContext();



    return (
        <div>
            <label htmlFor="category-filter">Filtruj według kategorii:</label>
            <select
                id="category-filter"
                value={filters.category}
                onChange={e => {
                   updateFilter('category', e.target.value);
                }}
            >
                <option value="all">Wszystkie</option>
                {categories.map((category, index) => (
                    <option key={index} value={category}>
                        {category}
                    </option>
                ))}
            </select><br/>
            <label htmlFor={'minAmount'}>minimalna cena</label>
            <input id={'minAmount'} value={filters.minAmount} onChange={e=>updateFilter('minAmount', e.target.value)}/><br/>
            <label htmlFor={'maxAmount'}>maksymalna cena</label>
            <input id={'maxAmount'} value={filters.maxAmount} onChange={e=>updateFilter('maxAmount', e.target.value)}/>
        </div>
    );
}

