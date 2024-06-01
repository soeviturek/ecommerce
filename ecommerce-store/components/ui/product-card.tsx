"use client"

import { Product } from "@/types";
import Image from "next/image";
import { Expand, ShoppingCart } from "lucide-react";
import IconButton from "./icon-button";
import Currency from "./currency";
import { useRouter } from "next/navigation";
import { MouseEventHandler } from "react";
import usePreviewModal from "@/hooks/use-preview-modals";
interface ProductCard{
    data: Product;
}
const ProductCard:React.FC<ProductCard> = ({data}) => {
    const router = useRouter();
    const previewModal = usePreviewModal();
    const handleClick = ()=>{
        router.push(`/product/${data?.id}`);
    };
    const onPreview:MouseEventHandler<HTMLButtonElement> = (event)=>{
        event.stopPropagation();
        previewModal.onOpen(data);
    };
    return ( 
        
    <div onClick={handleClick} className="bg-white group cursor-pointer rounded-xl border p-3 space-y-4">
        {/* images and actions */}
        <div className="aspect-square rounded-xl bg-gray-100 relative">
            {/* don't forget to adjust next.config and add cloudinary */}
            <Image fill
            src={data?.images?.[0]?.url}
            alt="Image"
            className="aspect-square object-cover rounded-md"/>
            {/* group-hover means when hover anywhere on the parent */}
            <div className="opacity-0 group-hover:opacity-100 transition absolute w-full px-6 bottom-5">
                <div className="flex gap-x-6 justify-center">
                    <IconButton onClick={onPreview}
                    icon={<Expand size={20} className="text-gray-600"/>}
                    />
                    <IconButton onClick={()=>{}}
                    icon={<ShoppingCart size={20} className="text-gray-600"/>}
                    />
                </div>
            </div>
        </div>
        {/* desc */}
        <div>
            <p className="font-semibold text-lg">
                {data.name}
            </p>
        </div>
        <div>
            <p className="font-semibold text-sm text-gray-500">
                {data.category?.name}
            </p>
        </div>
        {/* price */}
        <div>
            <p className="flex items-center justify-between">
                <Currency value={data?.price} />
            </p>
        </div>
    </div>);
}
 
export default ProductCard;