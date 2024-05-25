"use client"

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { Plus } from "lucide-react"
import Image from "next/image"
import { useParams,useRouter } from "next/navigation"
import { BillboardColumn } from "./columns"

// client component to load all billboards

interface BillboardClientProps{
    data:BillboardColumn[]
}

export const BillboardClient:React.FC<BillboardClientProps> = ({data})=>{
    //the form to create a new billboard
    const router = useRouter();
    const params = useParams();

    return (
        <div>
            <div className="flex items-center justify-between">
                <Heading 
                title={`Billboards (${data.length})`}
                description="Manage billboards for your store"
                />  
                
                <Button onClick={()=>{router.push(`/${params.storeId}/billboards/new`)}}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add New
                </Button>
            </div>
            <Separator/>
            <div>
                {data.map((billboard)=>(
                    <div>
                        <div className="relative w-[200px] h-[200px] rounded-md overflow-hidden">
                            {/* <Image fill className="hover-over" alt="Image" src={billboard.imageUrl} /> */}
                        </div>
                        {/* {billboard.imageUrl} */}
                        {billboard.label}
                    </div>
                ))
                }

            </div>
            {/* Further code to get all billboards */}
            
    </div>
            
    )
}