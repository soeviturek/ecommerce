"use client"

import { useEffect, useState } from "react";

interface CurrencyProps{
    value?:string | number;
}
export const formatter = new Intl.NumberFormat("en-us",{
    style:'currency',
    currency:"USD"
});

const Currency: React.FC<CurrencyProps> = ({value}) => {
    const [isMounted,setIsMounted] = useState(false);
    useEffect(()=>{
        setIsMounted(true);
    },[]);
    if(!isMounted){
        return null;
    }

    return ( 
        <div className="font-semibold">
            {formatter.format(Number(value))}
        </div>
     );
}
 
export default Currency;