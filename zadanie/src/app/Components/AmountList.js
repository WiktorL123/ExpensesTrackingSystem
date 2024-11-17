'use client';
import Amount from "@/app/Components/Amount";
export default function AmountList({amounts = [], onRemoveAmount = f=>f, onShowDetails = f=>f, onEditAmount = f=>f} ) {
    if (!amounts.length) return <div>No amounts here!</div>
    return (
        <div>
            {amounts.map(amount => <Amount
                key={amount.id}
                {...amount}
                onRemove={onRemoveAmount}
                onShow = {()=>onShowDetails(amount)}
                onEdit={()=>onEditAmount(amount)}

                />
            )}
        </div>
    )

}