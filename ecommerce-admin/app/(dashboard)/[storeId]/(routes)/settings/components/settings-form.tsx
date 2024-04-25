"use client"

import { Store } from "@prisma/client";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Form } from "@/components/ui/form";
interface SettingsFormProps{
    initialData: Store;
};
const formSchema = z.object({
    name:z.string().min(1),
});

type SettingsFormValues = z.infer<typeof formSchema>;

// this component is only used in settings therefore the folder can be put under settings
export const SettingsForm:React.FC<SettingsFormProps> = ({initialData}) => {

    //controlls alert model, slightly different from store modal
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const form = useForm<SettingsFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData,
    });

    const onSubmit = async (data: SettingsFormValues) =>{
        console.log(data);
    };
    
    return (
        <>
            <div className="flex items-center justify-between">
                <Heading title="Settings" description="Manage store preferences" />
                <Button variant="destructive" size="sm" onClick={()=>{}}>
                    <Trash className="h-4 w-4" />
                </Button>
            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                </form>
            </Form>
        </>
    )
};