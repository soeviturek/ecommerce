import prismadb from "@/lib/prismadb";
import { Item } from "@radix-ui/react-dropdown-menu";

export const getStockCount = async (storeId:string)=>{
    const stockCount = await prismadb.product.count({
        where:{
            storeId,
            isArchived:false,
        }
    });


    return stockCount;
};