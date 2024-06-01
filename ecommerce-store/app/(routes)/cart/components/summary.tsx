"use client";

import Button from "@/components/ui/button";
import Currency from "@/components/ui/currency";
import useCart from "@/hooks/use-cart";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";

const Summary = () => {
    const searchParams = useSearchParams();
    const items=useCart((state)=>state.items);
    const removeAll =useCart((state)=>state.removeAll);
    const total = items.reduce((total,item)=>{
        return total+Number(item.price);
    },0)

    useEffect(()=>{
        if(searchParams.get("success")){
            toast.success("Payment completed.");
            removeAll();
        }
        else if(searchParams.get("cancelled")){
            toast.error("Something went wrong.");
        }
    },[searchParams,removeAll]);

    const onCheckout = async () =>{
        if(items.length == 0){
            toast.error("Cart is empty");
            return
        }
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/checkout`,{
            productIds:items.map((item)=>item.id),
        });
        window.location = response.data.url;
    }
    return ( 
        <div className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
            <h2 className="text-lg font-medium text-gray-900">
                Order Summary
            </h2>
            <div className="mt space-y-4">
                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                    <div className="text-base font-medium text-gray-900">
                        Order total
                    </div>
                    <Currency value={total}/>
                </div>
            </div>
            <Button onClick={onCheckout} className="w-full mt-6">
                Checkout
            </Button>
        </div>
     );
}
 
export default Summary;