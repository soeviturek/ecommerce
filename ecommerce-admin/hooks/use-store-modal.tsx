import {create} from "zustand"

interface useStoreModalStore{
    isOpen: boolean;
    onOpen: ()=> void; //should be void instead of empty object {}
    onClose: ()=> void;
};

export const useStoreModal = create<useStoreModalStore>((set) =>({
    isOpen: false,
    onOpen: ()=>set({isOpen:true}),
    onClose:()=> set({isOpen:false}),
}))