'use client';
import  {useAmountsContext} from "@/app/providers/AmountProvider";
import AmountList from './Components/AmountList';
import Filter from './Components/Filter';
import AddAmountForm from './Components/AddAmountForm';
import Modal from './Components/Modal';
import EditAmountForm from './Components/EditAmountForm';

export default function Home() {
    const {
        amounts,
        selectedCategory,
        selectedAmount,
        editingAmount,
        setSelectedAmount,
    } = useAmountsContext();


    const filteredAmounts = selectedCategory === "all"
        ? amounts
        : amounts.filter(item => item.category === selectedCategory);


    return (
        <div>
            <AddAmountForm
            />
            <Filter

            />

            <AmountList
                amounts={filteredAmounts}

            />
            {selectedAmount && (
                <Modal onClose={() => setSelectedAmount(null)}>
                    <h1>{selectedAmount.title}</h1>
                    <p>{selectedAmount.description}</p>
                </Modal>
            )}
            {editingAmount && (
                <EditAmountForm

                />
            )}
        </div>
    );
}
