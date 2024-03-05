"use client";
import { Modal } from "@/components/ui/modal";
import { useStoreModal } from "@/hooks/use-store-modal";
import { useEffect } from "react";

// destruct import
const SetupPage = () => {
  //this is a much better way to trigger a modal than writing <StoreModal>
  const onOpen = useStoreModal((state) => state.onOpen);
  const isOpen = useStoreModal((state) => state.isOpen);

  useEffect(()=> {
    if(!isOpen){
      onOpen();
    } 
  },[isOpen,onOpen]); //dependency array

  //only need setupPage to trigger modal
  return null;
}

export default SetupPage;

