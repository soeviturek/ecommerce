"use client"

import { ShoppingBag } from "lucide-react";
import Button from "./ui/buttonC";
import { useEffect, useState } from "react";
import useCart from "@/hooks/use-cart";
import { useRouter } from "next/navigation";
import { ModeToggle } from "./theme-toggle";

const NavbarActions = ()=>{

    const router = useRouter();
    // mount fix for amount, our cart use local storage to preserve the amount
    // prevent hydration error
    const [isMounted,setIsMounted] = useState(false);
    useEffect(()=>{
        setIsMounted(true);
    },[]);

    const cart = useCart();
    return (
        <div className="ml-auto flex items-center gap-x-4">
            <Button onClick={()=>router.push("/cart")} className="flex items-center rounded-full bg-black px-4 py-2">
                <ShoppingBag size={20} color="white"/>
                {/* amount in the cart */}
                <span className="ml-2 text-sm font-medium text-white">
                    {cart.items.length}
                </span>
            </Button>

            <ModeToggle/>
        </div>
        
    )
}

export default NavbarActions;