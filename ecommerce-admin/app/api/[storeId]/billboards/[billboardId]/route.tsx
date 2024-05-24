import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH (
    req: Request, 
    // storeId comes from the folder name
    {params}:{params:{
        storeId:string,
        billboardId:string
    }}
){
    try {
        const {userId} = auth();
        const body = await req.json();
        const {label,imageUrl} = body;
        if(!userId){
            return new NextResponse("Unauthenticated",{status:401});
        }
        if(!label){
            return new NextResponse("Label is required",{status:400});
        }
        if(!imageUrl){
            return new NextResponse("ImageUrl is required",{status:400});
        }
        if(!params.billboardId){
            return new NextResponse("Billboard id is required",{status:400});
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
        const billboard = await prismadb.billboard.updateMany({
            where:{
                id:params.billboardId,
            },
            data:{
                label,
                imageUrl
            }
        })
        return NextResponse.json(billboard);

    } catch (error) {
        // single store, patch method, easy to debug
        console.log('[BILLBOARD_PATCH]',error);
        return new NextResponse("Internal error",{status:500});
    }
}

export async function DELETE (
    req: Request, //do not remove req,params is only available in the second argument of delete function
    // storeId comes from the folder name
    {params}:{params:{storeId:string,billboardId:string}}
){
    try {
        const {userId} = auth();
        if(!userId){
            return new NextResponse("Unauthenticated",{status:401});
        }

        if(!params.billboardId){
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

        // userId is not unique, so have to use deleteMany()
        const billboard = await prismadb.billboard.deleteMany({
            where:{
                id:params.billboardId,
            }
        });
        return NextResponse.json(billboard);

    } catch (error) {
        // single store, patch method, easy to debug
        console.log('[BILLBOARD_DELETE]',error);
        return new NextResponse("Internal error",{status:500});
    }
}

export async function GET (
    req: Request,
    {params}:{params:{billboardId:string}}
){
    try {
        // userId is not unique, so have to use deleteMany()
        const billboard = await prismadb.billboard.findUnique({
            where:{
                id:params.billboardId,
            }
        });
        return NextResponse.json(billboard);

    } catch (error) {
        // single store, patch method, easy to debug
        console.log('[BILLBOARD_GET]',error);
        return new NextResponse("Internal error",{status:500});
    }
}

