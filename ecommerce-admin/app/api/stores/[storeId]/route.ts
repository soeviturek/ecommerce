import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH (
    req: Request, 
    // storeId comes from the folder name
    {params}:{params:{storeId:string}}
){
    try {
        const {userId} = auth();
        const body = await req.json();
        const {name} = body;
        if(!userId){
            return new NextResponse("Unauthenticated",{status:401});
        }
        if(!name){
            return new NextResponse("Name is required",{status:400});
        }
        if(!params.storeId){
            return new NextResponse("Store id is required",{status:400});
        }
        const store = await prismadb.store.updateMany({
            where:{
                id:params.storeId,
                userId
            },data:{
                name
            }
        });
        return NextResponse.json(store);

    } catch (error) {
        // single store, patch method, easy to debug
        console.log('[STORE_PATCH]',error);
        return new NextResponse("Internal error",{status:500});
    }
}

export async function DELETE (
    req: Request, //do not remove req,params is only available in the second argument of delete function
    // storeId comes from the folder name
    {params}:{params:{storeId:string}}
){
    try {
        const {userId} = auth();
        if(!userId){
            return new NextResponse("Unauthenticated",{status:401});
        }
        if(!params.storeId){
            return new NextResponse("Store id is required",{status:400});
        }
        // userId is not unique, so have to use deleteMany()
        const store = await prismadb.store.deleteMany({
            where:{
                id:params.storeId,
                userId
            }
        });
        return NextResponse.json(store);

    } catch (error) {
        // single store, patch method, easy to debug
        console.log('[STORE_DELETE]',error);
        return new NextResponse("Internal error",{status:500});
    }
}

