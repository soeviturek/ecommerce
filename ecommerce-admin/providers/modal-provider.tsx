"use client";

import { useEffect,useState } from "react";
import { StoreModal } from "@/components/modals/store-modal";

//this return a StoreModal and controlls the rendering of it
//client component, make sure use this useEffect code to fix hydration error
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