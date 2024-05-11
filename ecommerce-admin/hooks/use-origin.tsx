import { useState, useEffect } from "react"


export const useOrigin = () =>{
    //You can use this trick to check if the component has been mounted
    const [mounted, setMounted] = useState(false);
    // if the window is available, if yes, check if the location exists, if yes, use it
    const origin = typeof window !== "undefined" && window.location.origin ? window.location.origin : '';

    useEffect (() =>{
        setMounted(true);
        
    },[]);
    if (!mounted){
        return '';
    }
    return origin;
}