"use client"

import { Image, Product } from "@prisma/client";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { AlertModal } from "@/components/modals/alert-modal";
import { ApiAlert } from "@/components/ui/api-alert";
import { useOrigin } from "@/hooks/use-origin";
import ImageUpload from "@/components/ui/image-upload";
interface ProductFormProps{
    initialData: Product & {
        images: Image[]
    } | null;
};

//change the name of zod
const formSchema = z.object({
    name:z.string().min(1),
    images:z.object({url:z.string()}).array(),
    price:z.coerce.number().min(1),
    colorId:z.string().min(1),
    categoryId:z.string().min(1),
    sizeId:z.string().min(1),
    isFeatured:z.boolean().default(false).optional(),
    isArchived:z.boolean().default(false).optional(),

});

type ProductFormValues = z.infer<typeof formSchema>;

// this component is only used in settings therefore the folder can be put under settings
export const ProductForm:React.FC<ProductFormProps> = ({initialData}) => {
    const params = useParams();
    const router = useRouter();
    const origin = useOrigin();
    //controlls alert model, slightly different from store modal
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // smart way of changing the title..
    const title = initialData ? "Edit product" : "Create product";
    const desc = initialData ? "Edit a product" : "Create a new product";
    const toastMessage = initialData ? "Product updated" : "Product created";
    const action = initialData ? "Save changes" : "Create";

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(formSchema),
        // in prisma price is a decimal type but here it is a float
        defaultValues: initialData ? {
            ...initialData,
            price: parseFloat(String(initialData?.price)),
        } : {
            name: '',
            images:[],
            price: 0,
            categoryId:'',
            sizeId:'',
            isFeatured:false,
            isArchived:false,
        }
    });

    const onDelete = async () =>{
        try {
            setLoading(true);

            await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
            router.refresh(); //resynchronise the server component page.tst to fetch store (call again) to get initialData
            router.push(`/${params.storeId}/products`);
            toast.success("Product deleted");
        } catch (error) {
            //safety meassure, can add on delete method later.
            toast.error("Make sure you removed all the catergories using this product before you remove.");   
        }finally{
            setLoading(false);
            setOpen(false); //close the modal
        }
    };
    const onSubmit = async (data: ProductFormValues) =>{
        try {
            setLoading(true);
            if(initialData){
                await axios.patch(`/api/${params.storeId}/products/${params.productId}`,data);
            }else{
                //otherwise, add it
                await axios.post(`/api/${params.storeId}/products`,data);
            }
            
            router.refresh(); //resynchronise the server component page.tst to fetch store (call again) to get initialData
            router.push(`/${params.storeId}/products`);
            toast.success(toastMessage);
        } catch (error) {
            //safety meassure, can add on delete method later.
            toast.error("Something wrong happened.");   
        }finally{
            setLoading(false);
        }
    };
    // const test = [{url:
    //     "https://res.cloudinary.com/dscnnrudb/image/upload/v1716973408/smzisxnvuru6btygt0yb.jpg"},
    //     {url:"https://res.cloudinary.com/dscnnrudb/image/upload/v1716632712/uy9kzfp8y6geg3hv4tqa.png"}]
    
    return (
        <>
            {/* If setOpen, show this alertModal,if closed, set open to false */}
            <AlertModal
                isOpen={open}
                onClose={()=>setOpen(false)}
                onConfirm={onDelete}
                loading={loading}
            />
            
            <div className="flex items-center justify-between">
                <Heading title={title} description={desc} />

                {/* only render it when we have initialData!! */}
                {initialData && (
                <Button variant="destructive" size="sm" onClick={()=>setOpen(true)}>
                    <Trash className="h-4 w-4" />
                </Button>
                )}
            </div>

            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                    <FormField
                        control={form.control}
                        name="images" 
                        render={({ field })=>(
                            <FormItem>
                                <FormLabel>Images</FormLabel>
                                <FormControl>
                                    <ImageUpload
                                        value={field.value.map((image)=>(image.url))}
                                        // value={test.map((image)=>image.url)}
                                        disabled={loading}
                                        // onChange={(url)=>field.onChange([...field.value,{url},{url:"https://res.cloudinary.com/dscnnrudb/image/upload/v1716973408/smzisxnvuru6btygt0yb.jpg"}])}
                                        onChange={(url)=>field.onChange([...field.value,{url}])}
                                        onRemove={(url)=>field.onChange([...field.value.filter((current)=>current.url !== url)])}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-3 gap-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field })=>(<FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    {/* Store name is autofield because we have passed the initial data and have defaultValues */}
                                    <Input disabled={loading} placeholder="Product Name" {...field}/>
                                </FormControl>
                                {/* You get proper error message */}
                                <FormMessage/>
                            </FormItem>)}
                        />
                    </div>
                    <Button disabled={loading} className="ml-auto" type="submit">
                        {action}
                    </Button>
                </form>
            </Form>
            
        </>
    )
};