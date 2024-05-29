import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";


export async function PATCH (
    req: Request, 
    // storeId comes from the folder name
    {params}:{params:{
        storeId:string,
        productId:string
    }}
){
    try {
        const {userId} = auth();
        const body = await req.json();
        const {name,
            price,
            isFeatured,
            isArchived,
            sizeId,
            colourId,
            categoryId,
            images,} = body;
        if(!userId){
            return new NextResponse("Unauthenticated",{status:401});
        }
        if(!name){
            return new NextResponse("Name is required",{status:400});
        }
        if(!price){
            return new NextResponse("Price is required",{status:400});
        }
        if(!categoryId){
            return new NextResponse("Category id is required",{status:400});
        }
        if(!sizeId){
            return new NextResponse("Size id is required",{status:400});
        }
        if(!colourId){
            return new NextResponse("Colour id is required",{status:400});
        }
        if(!params.productId){
            return new NextResponse("Product id is required",{status:400});
        }
        if(!images || !images.length){
            return new NextResponse("Images are required",{status:400})
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
        //modify the query a little bit, delete images first
        await prismadb.product.update({
            where:{
                id:params.productId,
            },
            data:{
                name,
                price,
                isFeatured,
                isArchived,
                sizeId,
                colourId,
                categoryId,
                images:{
                    deleteMany:{}
                }
            }
        });

        //update Images
        const product = await prismadb.product.update({where:{
            id:params.productId,
            },
            data:{
                name,
                price,
                isFeatured,
                isArchived,
                sizeId,
                colourId,
                categoryId,
                images:{
                    createMany:{
                        data:[...images.map((image:{url:string})=>image)]
                    }
                }
            }
        });

        return NextResponse.json(product);

    } catch (error) {
        // single store, patch method, easy to debug
        console.log('[PRODUCT_PATCH]',error);
        return new NextResponse("Internal error",{status:500});
    }
}

export async function DELETE (
    req: Request, //do not remove req,params is only available in the second argument of delete function
    // storeId comes from the folder name
    {params}:{params:{storeId:string,productId:string}}
){
    try {
        const {userId} = auth();
        if(!userId){
            return new NextResponse("Unauthenticated",{status:401});
        }

        if(!params.productId){
            return new NextResponse("Product id is required",{status:400});
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
        const product = await prismadb.product.deleteMany({
            where:{
                id:params.productId,
            }
        });
        return NextResponse.json(product);

    } catch (error) {
        // single store, patch method, easy to debug
        console.log('[PRODUCT_DELETE]',error);
        return new NextResponse("Internal error",{status:500});
    }
}

export async function GET (
    req: Request,
    {params}:{params:{productId:string}}
){
    try {
        // userId is not unique, so have to use deleteMany()
        const product = await prismadb.product.findUnique({
            where:{
                id:params.productId,
            },
            include:{
                images:true,
                category:true,
                colour:true,
                size:true
            }
        });
        return NextResponse.json(product);

    } catch (error) {
        // single store, patch method, easy to debug
        console.log('[PRODUCT_GET]',error);
        return new NextResponse("Internal error",{status:500});
    }
}

