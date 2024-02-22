"use client";
import { Modal } from "@/components/ui/modal";
import { useStoreModal } from "@/hooks/use-store-modal";
import { useEffect } from "react";

// import { Button } from "@/components/ui/button";
// // destruct import
const SetupPage = () => {
  //this is a much better way to trigger a modal than writing <StoreModal>
  const onOpen = useStoreModal((state) => state.onOpen);
  const isOpen = useStoreModal((state) => state.isOpen);

  useEffect(()=> {
    if(!isOpen){
      onOpen();
    } 
  },[isOpen,onOpen]); //dependency array

  return (
    <div className="p-4">
      Root Page
    </div>
  );
}

export default SetupPage;

