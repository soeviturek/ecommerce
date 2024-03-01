import {create} from "zustand"

interface useStoreModalStore{
    isOpen: boolean;
    onOpen: ()=> void; //should be void instead of empty object {}
    onClose: ()=> void;
};

// a set to control StoreModal, instead of directly manipulate the object
export const useStoreModal = create<useStoreModalStore>((set) =>({
    isOpen: false,
    onOpen: ()=>set({isOpen:true}),
    onClose:()=> set({isOpen:false}),
}))