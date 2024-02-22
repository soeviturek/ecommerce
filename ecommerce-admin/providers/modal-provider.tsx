"use client";

import { useEffect,useState } from "react";
import { StoreModal } from "@/components/modals/store-modal";

//client component, make sure use this code to fix hydration error
export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(()=>{
        setIsMounted(true);
    },[]);

    if (!isMounted){
        return null;
    }
    return (
        <>
        {/* can be accessed globally */}
        <StoreModal/>
        </>
    )
}