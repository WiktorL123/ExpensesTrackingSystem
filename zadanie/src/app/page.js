'use client'
import amountData from './data/data.json'
import {useState} from "react";
import AmountList from "./Components/AmountList";
import Filter from "@/app/Components/Filter";

export default function Home() {
    const [amounts, setAmounts] = useState(amountData)
    const [selectedCategory, setSelectedCategory] = useState("");



    const categories = [...new Set(amounts.map(item=>item.category))]

    const filteredAmounts = selectedCategory
        ? amounts.filter(item => item.category === selectedCategory)
        : amounts;


    return (
    <div>
        <Filter
        categories={categories}
        onSelectedCategory ={selectedCategory}
        onCategoryChange={setSelectedCategory}
        />
        <AmountList
        amounts = {filteredAmounts}
        onRemoveAmount = {id=>{
            const newAmounts = amounts.filter(amount=>amount.id!==id)
            setAmounts(newAmounts)
        }}


        />
    </div>
  );
}
