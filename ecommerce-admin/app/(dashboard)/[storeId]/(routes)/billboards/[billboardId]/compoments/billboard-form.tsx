"use client"

import { Billboard } from "@prisma/client";
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
interface BillboardFormProps{
    initialData: Billboard | null;
};

//change the name of zod
const formSchema = z.object({
    label:z.string().min(1),
    imageUrl: z.string().min(1)
});

type BillboardFormValues = z.infer<typeof formSchema>;

// this component is only used in settings therefore the folder can be put under settings
export const BillboardForm:React.FC<BillboardFormProps> = ({initialData}) => {
    const params = useParams();
    const router = useRouter();
    const origin = useOrigin();
    //controlls alert model, slightly different from store modal
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // smart way of changing the title..
    const title = initialData ? "Editbillboard" : "Create billboard";
    const desc = initialData ? "Edit a billboard" : "Create a new billboard";
    const toastMessage = initialData ? "Billboard updated" : "Billboard created";
    const action = initialData ? "Save changes" : "Create";

    const form = useForm<BillboardFormValues>({
        resolver: zodResolver(formSchema),
        // it may be null so we need to manually fix it
        defaultValues: initialData || {
            label: '',
            imageUrl:''
        },
    });

    const onDelete = async () =>{
        try {
            setLoading(true);

            await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`);
            router.refresh(); //resynchronise the server component page.tst to fetch store (call again) to get initialData
            router.push("/"); //go back to homepage, check if there is any new store, otherwise, create new store
            toast.success("Billboard deleted");
        } catch (error) {
            //safety meassure, can add on delete method later.
            toast.error("Make sure you removed all the catergories using this billboard before you remove.");   
        }finally{
            setLoading(false);
            setOpen(false); //close the modal
        }
    };
    const onSubmit = async (data: BillboardFormValues) =>{
        try {
            setLoading(true);
            if(initialData){
                //if there is initialdata, patch the billboard and update it
                await axios.patch(`/api/${params.storeId}/billboards/${params.billboardId}`,data);
            }else{
                //otherwise, add it
                await axios.post(`/api/${params.storeId}/billboards`,data);
            }
            
            router.refresh(); //resynchronise the server component page.tst to fetch store (call again) to get initialData
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
                    <FormField
                        control={form.control}
                        name="imageUrl" //it matches formSchema.name
                        render={({ field })=>(
                        <FormItem>
                            <FormLabel>BackgroundImage</FormLabel>
                            <FormControl>
                                <ImageUpload
                                // pass in an array of one url or just pass in empty array
                                    value={field.value ? [field.value] : []}
                                    disabled={loading}
                                    onChange={(url)=>field.onChange(url)}
                                    onRemove={()=>field.onChange("")}
                                
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>)}
                    />
                    <FormField
                        control={form.control}
                        name="label" //it matches formSchema.name
                        render={({ field })=>(<FormItem>
                            <FormLabel>Label</FormLabel>
                            <FormControl>
                                {/* Store name is autofield because we have passed the initial data and have defaultValues */}
                                <Input disabled={loading} placeholder="Billboard Label" {...field}/>
                            </FormControl>
                            {/* You get proper error message */}
                            <FormMessage/>
                        </FormItem>)}
                    />
                <Button disabled={loading} className="ml-auto" type="submit">
                    {action}
                </Button>
                </form>
            </Form>
            
        </>
    )
};