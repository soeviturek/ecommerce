import prismadb from "@/lib/prismadb";
import { Item } from "@radix-ui/react-dropdown-menu";

export const getSalesCount = async(storeId:string)=>{
    const salesCount = await prismadb.order.count({
        where:{
            storeId,
            isPaid:true,
        }
    });


    return salesCount;
};