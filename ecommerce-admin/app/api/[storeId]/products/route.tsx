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
        const {name,
            price,
            categoryId,
            colourId,
            sizeId,
            images,
            isFeatured,
            isArchived
        } = body;
        
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
        if(!images || !images.length){
            return new NextResponse("Images are required",{status:400})
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

        const product = await prismadb.product.create({
            data:{
                name,
                price,
                isFeatured,
                isArchived,
                sizeId,
                colourId,
                categoryId,
                images:{
                    // create image array
                    createMany:{
                        data:[
                            ...images.map((image:{url:string})=>image)
                        
                        ]
                    }
                },
                storeId:params.storeId
            }
        });
        return NextResponse.json(product);

    } catch (error) {
        console.log('[PRODUCTS_POST]',error);
        return new NextResponse("Internal error",{status:500});
    }
}
export async function GET (
    req: Request, 
    // storeId comes from the folder name
    {params}:{params:{storeId:string}}
){
    try {
        const {searchParams} = new URL(req.url);
        const categoryId=searchParams.get("categoryId")|| undefined;
        const colourId=searchParams.get("colourId")|| undefined;
        const sizeId=searchParams.get("sizeId")|| undefined;
        const isFeatured=searchParams.get("isFeatured")|| undefined;


        const products = await prismadb.product.findMany({
            where:{
                storeId:params.storeId,
                categoryId,
                colourId,
                sizeId,
                //undefined compelely ignores this, instead of false
                isFeatured: isFeatured?true:undefined,
                isArchived:false,

            },
            include:{
                images:true,
                category:true,
                colour:true,
                size:true,
            },
            orderBy:{
                createdAt:'desc'
            }
        });
        return NextResponse.json(products);

    } catch (error) {
        console.log('[PRODUCTS_GET]',error);
        return new NextResponse("Internal error",{status:500});
    }
}

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
        console.log('[PRODUCT_PATCH]',error);
        return new NextResponse("Internal error",{status:500});
    }
}
