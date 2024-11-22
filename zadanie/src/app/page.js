'use client';
import  {useAmountsContext} from "@/app/providers/AmountProvider";
import AmountList from './Components/AmountList';
import Filter from './Components/Filter';
import AddAmountForm from './Components/AddAmountForm';
import Modal from './Components/Modal';
import EditAmountForm from './Components/EditAmountForm';

export default function Home() {
    const {
        selectedAmount,
        editingAmount,
    } = useAmountsContext();

    return (
        <div>
            <AddAmountForm/>
            <Filter/>
            <AmountList/>
            {selectedAmount && (<Modal ></Modal>)}
            {editingAmount && (<EditAmountForm/>)}
        </div>
    );
}
