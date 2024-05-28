"use client"

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { Plus } from "lucide-react"
import { useParams,useRouter } from "next/navigation"
import { SizeColumn, columns } from "./columns"
import { DataTable } from "@/components/ui/data-table"
import { ApiList } from "@/components/ui/api-list"

// client component to load all billboards

interface SizeClientProps{
    data:SizeColumn[]
}

export const SizeClient:React.FC<SizeClientProps> = ({data})=>{
    //the form to create a new billboard
    const router = useRouter();
    const params = useParams();

    return (
        <div>
            <div className="flex items-center justify-between">
                <Heading 
                title={`Sizes (${data.length})`}
                description="Manage sizes for your store"
                />
                
                <Button onClick={()=>{router.push(`/${params.storeId}/sizes/new`)}}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add New
                </Button>
            </div>
            <Separator/>
            <DataTable searchKey="name" columns={columns} data={data}/>    

            <Heading title="API" description="API calls for Billboards" />
            <Separator />
            <ApiList entityName="sizes" entityIdName="sizeId"/>
    </div>
            
    )
}