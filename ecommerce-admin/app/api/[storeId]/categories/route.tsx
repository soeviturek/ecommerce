import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";


export async function POST (
    req: Request, 
    // storeId comes from the folder name
    {params}:{params:{storeId:string}}
){
    try {
        const {userId} = auth();
        const body = await req.json();
        const {name,billboardId} = body;
        
        if(!userId){
            return new NextResponse("Unauthenticated",{status:401});
        }
        if(!name){
            return new NextResponse("Name is required",{status:400});
        }
        if(!billboardId){
            return new NextResponse("Billboard id is required",{status:400});
        }
        if(!params.storeId){
            return new NextResponse("Store id is required",{status:400});
        }
        const storeByUserId = await prismadb.store.findFirst({
            where:{
                id:params.storeId,
                userId
            }
        }
        )
        //check if the store is owned by userId
        if(!storeByUserId){
            return new NextResponse("Unauthorized",{status:403})
        }

        const category = await prismadb.category.create({
            data:{
                name,
                billboardId:billboardId,
                storeId:params.storeId
            }
        });
        return NextResponse.json(category);

    } catch (error) {
        console.log('[CATEGORIES_POST]',error);
        return new NextResponse("Internal error",{status:500});
    }
}
export async function GET (
    req: Request, 
    // storeId comes from the folder name
    {params}:{params:{storeId:string}}
){
    try {
        

        const categories = await prismadb.category.findMany({
            where:{
                storeId:params.storeId,
                // You probably won't need this? 
                // Because categories by specific store is enough.. don't need to switch between billboards
                // billboardId:params.billboardId,
            }
        });
        return NextResponse.json(categories);

    } catch (error) {
        console.log('[CATEGORIES_GET]',error);
        return new NextResponse("Internal error",{status:500});
    }
}
