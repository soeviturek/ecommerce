import prismadb from "@/lib/prismadb";
import { ProductClient } from "./components/client";
import { ProductColumn } from "./components/columns";
import {format} from "date-fns";
import { formatter } from "@/lib/utils";
const ProductsPage = async (
    {params}:{
        params:{storeId:string}
    }


) =>{

    const products = await prismadb.product.findMany(
        {
            where:{
                storeId:params.storeId
            },
            // include these so that we can show that in the table (or populate??)
            include:{
                category:true,
                size: true,
                colour:true,
            },
            orderBy:{
                createdAt:'desc'
            }
    });
    const formattedProducts: ProductColumn[] = products.map((item)=>({
        id:item.id,
        name:item.name,
        isFeatured: item.isFeatured,
        isArchived: item.isArchived,
        price: formatter.format(item.price.toNumber()),
        category: item.category.name,
        size: item.size.name,
        colour:item.colour.name,
        createdAt:format(item.createdAt,"MMMM do, yyyy"),
        
    }
    ))

    return (
        <>
            <div className="flex-1 space-y-4 p-8 pt=6">
                <ProductClient data={formattedProducts}/>
            </div>
        </>
    )
}
export default ProductsPage;