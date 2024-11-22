'use client';
import Amount from "@/app/Components/Amount";
import {useAmountsContext} from "@/app/providers/AmountProvider";
export default function AmountList() {
   const {removeAmount, setSelectedAmount, setEditingAmount, filteredAmounts} = useAmountsContext()

    if (!filteredAmounts.length) return <div>No amounts here!</div>

    return (
        <div>

            {filteredAmounts.map(amount => <Amount
                key={amount.id}
                {...amount}
                onRemove={removeAmount}
                onShow = {()=>setSelectedAmount(amount)}
                onEdit={()=>setEditingAmount(amount)}

                />
            )}
        </div>
    )

}