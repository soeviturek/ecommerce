"use client";

import { useEffect, useState } from "react";
import { Button } from "./button";
import { ImagePlus, Trash } from "lucide-react";
import Image from "next/image";
import { CldUploadWidget } from 'next-cloudinary';

interface ImageUploadProps{
    disabled?: boolean;
    onChange: (value: string) => void;
    onRemove: (value:string) => void;
    value:string[];
}

const ImageUpload:React.FC<ImageUploadProps>= ({
    disabled,
    onChange,
    onRemove,
    value
}) => {

    //it is any type because cloudinary doesn't have type
    const onUpload= (result:any) =>{
        onChange(result.info.secure_url);
        
    }


    //sinse this is not inside provider to be protected, need to add this here
    const [isMounted,setIsMounted] = useState(false);
    useEffect(()=>{
        setIsMounted(true);
    },[])
    if (!isMounted){
        return null;
    }


    return (
        <div>
            <div className="mb-4 flex -items-center gap-4">
                {/* iterate over image */}
                {value.map((url)=>(
                    <div key={url} className="relative w-[200px] h-[200px] rounded-md overflow-hidden"
                    >
                        <div className="z-10 absolute top-2 right-2">
                            <Button type="button" onClick={()=>onRemove(url)} variant="destructive" size="icon">
                                <Trash className="h-4 w-4"/>
                            </Button>
                            {/* You need to specify the domain of cloudinary in next.config.js */}
                            <Image fill className="object-cover" alt="Image" src={url}/>
                        </div>
                    </div>
                ))}
                <CldUploadWidget onSuccess={onUpload} uploadPreset="wsaiu5u2">
                            {
                                ({open}) => {
                                    const onClick = ()=>{
                                        open();
                                    }

                                    return (
                                        <Button 
                                            type="button" 
                                            disabled={disabled} 
                                            variant="secondary" 
                                            onClick={onClick}
                                        >
                                            <ImagePlus className="h-4 w-4 mr-2"/>
                                            Upload an Image
                                        </Button>
                                    )
                                }
                            }
                        </CldUploadWidget>
            </div>
        </div>
    )
};


export default ImageUpload;