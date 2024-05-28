"use client"

import { Category, Billboard } from "@prisma/client";
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
import { useOrigin } from "@/hooks/use-origin";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
interface CategoryFormProps{
    initialData: Category | null;
    billboards: Billboard[];
};

//change the name of zod
const formSchema = z.object({
    name:z.string().min(1),
    billboardId:z.string().min(1),
});

type CategoryFormValues = z.infer<typeof formSchema>;

// this component is only used in settings therefore the folder can be put under settings
export const CategoryForm:React.FC<CategoryFormProps> = ({initialData,billboards}) => {
    const params = useParams();
    const router = useRouter();
    const origin = useOrigin();
    //controlls alert model, slightly different from store modal
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // smart way of changing the title..
    const title = initialData ? "Edit Category" : "Create Category";
    const desc = initialData ? "Edit a category" : "Create a new category";
    const toastMessage = initialData ? "Category updated" : "Category created";
    const action = initialData ? "Save Changes" : "Create";

    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(formSchema),
        // it may be null so we need to manually fix it
        defaultValues: initialData || {
            name: '',
            billboardId: '',
        },
    });

    const onDelete = async () =>{
        try {
            setLoading(true);

            await axios.delete(`/api/${params.storeId}/categories/${params.categoryId}`);
            router.refresh(); //resynchronise the server component page.tst to fetch store (call again) to get initialData
            router.push(`/${params.storeId}/categories`); //go back to Categorys page, check if there is any new store, otherwise, create new store
            toast.success("Category deleted");
        } catch (error) {
            //safety meassure, can add on delete method later.
            toast.error("Make sure you removed all the products using this category before you remove.");   
        }finally{
            setLoading(false);
            setOpen(false); //close the modal
        }
    };
    const onSubmit = async (data: CategoryFormValues) =>{
        try {
            setLoading(true);
            if(initialData){
                //if there is initialdata, patch the Category and update it
                await axios.patch(`/api/${params.storeId}/categories/${params.categoryId}`,data);
            }else{
                //otherwise, add it
                await axios.post(`/api/${params.storeId}/categories`,data);
            }
            
            router.refresh(); //resynchronise the server component page.tst to fetch store (call again) to get initialData
            router.push(`/${params.storeId}/categories`);
            toast.success(toastMessage);
        } catch (error) {
            //safety meassure, can add on delete method later.
            toast.error("Something wrong happened.");   
        }finally{
            setLoading(false);
        }
    };
    
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
                    <div className="grid grid-cols-3 gap-8">
                        <FormField
                            control={form.control}
                            name="name" //it matches formSchema.name
                            render={({ field })=>(<FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    {/* Store name is autofield because we have passed the initial data and have defaultValues */}
                                    <Input disabled={loading} placeholder="Category Name" {...field}/>
                                </FormControl>
                                {/* You get proper error message */}
                                <FormMessage/>
                            </FormItem>)}
                        />
                        <FormField
                            control={form.control}
                            name="billboardId" //it matches formSchema.name
                            render={({ field })=>(
                            <FormItem>
                                <FormLabel>Billboard</FormLabel>
                                    <Select 
                                        disabled={loading} 
                                        onValueChange={field.onChange} 
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue 
                                                    defaultValue={field.value} 
                                                    placeholder="Select a Billboard"
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {billboards.map((billboard)=>(
                                                <SelectItem key={billboard.id} value={billboard.id}>
                                                    {billboard.label}
                                                </SelectItem>
                                                )
                                            )}
                                        </SelectContent>
                                    </Select>
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