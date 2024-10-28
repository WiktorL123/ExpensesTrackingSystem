import React from 'react';

export default function Filter({ categories, selectedCategory, onCategoryChange }) {
    return (
        <div>
            <label style={labelStyle} htmlFor="category-filter">Filtruj według kategorii:</label>
            <select
                id="category-filter"
                value={selectedCategory}
                onChange={e => onCategoryChange(e.target.value)}
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
