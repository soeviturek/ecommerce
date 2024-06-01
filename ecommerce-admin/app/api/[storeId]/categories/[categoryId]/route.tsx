import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";


export async function PATCH (
    req: Request, 
    // storeId comes from the folder name
    {params}:{params:{
        storeId:string,
        categoryId:string
    }}
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
        if(!params.categoryId){
            return new NextResponse("Category id id is required",{status:400});
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
        const category = await prismadb.category.updateMany({
            where:{
                id:params.categoryId,
            },
            data:{
                name,
                billboardId
            }
        })
        return NextResponse.json(category);

    } catch (error) {
        // single store, patch method, easy to debug
        console.log('[CATEGORY_PATCH]',error);
        return new NextResponse("Internal error",{status:500});
    }
}

export async function DELETE (
    req: Request, //do not remove req,params is only available in the second argument of delete function
    // storeId comes from the folder name
    {params}:{params:{storeId:string,categoryId:string}}
){
    try {
        const {userId} = auth();
        if(!userId){
            return new NextResponse("Unauthenticated",{status:401});
        }

        if(!params.categoryId){
            return new NextResponse("Category id is required",{status:400});
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
        const category = await prismadb.category.deleteMany({
            where:{
                id:params.categoryId,
            }
        });
        return NextResponse.json(category);

    } catch (error) {
        // single store, patch method, easy to debug
        console.log('[CATEGORY_DELETE]',error);
        return new NextResponse("Internal error",{status:500});
    }
}

export async function GET (
    req: Request,
    {params}:{params:{categoryId:string}}
){
    try {
        if(!params.categoryId){
            return NextResponse.json("Category id is required",{status:400});
        }
        // userId is not unique, so have to use deleteMany()
        const category = await prismadb.category.findUnique({
            where:{
                id:params.categoryId,
            },
            include:{ //need to include billboard!!!
                billboard:true,
            }
        });
        return NextResponse.json(category);

    } catch (error) {
        // single store, patch method, easy to debug
        console.log('[CATEGORY_GET]',error);
        return new NextResponse("Internal error",{status:500});
    }
}

