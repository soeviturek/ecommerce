"use client"

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
import { Colour } from "@prisma/client";
interface ColourFormProps{
    initialData: Colour | null;
};

//change the name of zod
const formSchema = z.object({
    name:z.string().min(1),
    value: z.string().min(4).regex(/^#/,{message:'String must be a valid hex code'}),
});

type ColourFormValues = z.infer<typeof formSchema>;

// this component is only used in settings therefore the folder can be put under settings
export const ColourForm:React.FC<ColourFormProps> = ({initialData}) => {
    const params = useParams();
    const router = useRouter();
    const origin = useOrigin();
    //controlls alert model, slightly different from store modal
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // smart way of changing the title..
    const title = initialData ? "Edit colour" : "Create colour";
    const desc = initialData ? "Edit a colour" : "Create a new colour";
    const toastMessage = initialData ? "Colour updated" : "Colour created";
    const action = initialData ? "Save changes" : "Create";

    const form = useForm<ColourFormValues>({
        resolver: zodResolver(formSchema),
        // it may be null so we need to manually fix it
        defaultValues: initialData || {
            name: '',
            value:''
        },
    });

    const onDelete = async () =>{
        try {
            setLoading(true);

            await axios.delete(`/api/${params.storeId}/colours/${params.colourId}`);
            router.refresh(); //resynchronise the server component page.tst to fetch store (call again) to get initialData
            router.push(`/${params.storeId}/colours`);
            toast.success("Colour deleted");
        } catch (error) {
            //safety meassure, can add on delete method later.
            toast.error("Make sure you removed all the products using this colour before you remove.");   
        }finally{
            setLoading(false);
            setOpen(false); //close the modal
        }
    };
    const onSubmit = async (data: ColourFormValues) =>{
        try {
            setLoading(true);
            if(initialData){
                await axios.patch(`/api/${params.storeId}/colours/${params.colourId}`,data);
            }else{
                //otherwise, add it
                await axios.post(`/api/${params.storeId}/colours`,data);
            }
            
            router.push(`/${params.storeId}/colours`);
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
                    <div className="grid grid-cols-3 gap-8">
                        <FormField
                                control={form.control}
                                name="name" //it matches formSchema.name
                                render={({ field })=>(<FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        {/* Store name is autofield because we have passed the initial data and have defaultValues */}
                                        <Input disabled={loading} placeholder="Colour Name" {...field}/>
                                    </FormControl>
                                    {/* You get proper error message */}
                                    <FormMessage/>
                                </FormItem>)}
                            />
                        <FormField
                            control={form.control}
                            name="value" //it matches formSchema.name
                            render={({ field })=>(<FormItem>
                                <FormLabel>Value</FormLabel>
                                <FormControl>
                                    <div className="flex items-center gap-x-4">
                                        {/* Store name is autofield because we have passed the initial data and have defaultValues */}
                                        <Input disabled={loading} placeholder="Colour Value" {...field}/>
                                        <div className="border p-4 rounded-full" style={{backgroundColor:field.value}}/>
                                    </div>
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