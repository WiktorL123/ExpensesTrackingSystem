'use client';
import Amount from "@/app/Components/Amount";
import {useAmountsContext} from "@/app/providers/AmountProvider";
export default function AmountList({amounts}) {
   const {removeAmount, setSelectedAmount, setEditingAmount} = useAmountsContext()

    if (!amounts.length) return <div>No amounts here!</div>

    return (
        <div>

            {amounts.map(amount => <Amount
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