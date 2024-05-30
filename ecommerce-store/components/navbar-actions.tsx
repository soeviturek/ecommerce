"use client"

import { ShoppingBag } from "lucide-react";
import Button from "./ui/button";
import { useEffect, useState } from "react";

const NavbarActions = ()=>{
    // mount fix for amount, our cart use local storage to preserve the amount
    // prevent hydration error
    const [isMounted,setIsMounted] = useState(false);
    useEffect(()=>{
        setIsMounted(true);
    },[]);

    return (
        <div className="ml-auto flex items-center gap-x-4">
            <Button className="flex items-center rounded-full bg-black px-4 py-2">
                <ShoppingBag size={20} color="white"/>
                {/* amount in the cart */}
                <span className="ml-2 text-sm font-medium text-white">
                    0
                </span>
            </Button>
        </div>
        
    )
}

export default NavbarActions;