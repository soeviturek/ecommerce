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
        const {name,value} = body;
        
        if(!userId){
            return new NextResponse("Unauthenticated",{status:401});
        }
        if(!name){
            return new NextResponse("Name is required",{status:400});
        }
        if(!value){
            return new NextResponse("Value is required",{status:400});
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

        const colour = await prismadb.colour.create({
            data:{
                name,
                value,
                storeId:params.storeId
            }
        });
        return NextResponse.json(colour);

    } catch (error) {
        console.log('[COLOUR_POST]',error);
        return new NextResponse("Internal error",{status:500});
    }
}
export async function GET (
    req: Request, 
    // storeId comes from the folder name
    {params}:{params:{storeId:string}}
){
    try {
        

        const colour = await prismadb.colour.findMany({
            where:{
                storeId:params.storeId,
            }
        });
        return NextResponse.json(colour);

    } catch (error) {
        console.log('[COLOUR_GET]',error);
        return new NextResponse("Internal error",{status:500});
    }
}
