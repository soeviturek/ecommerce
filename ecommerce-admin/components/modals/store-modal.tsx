"use client";

import { useStoreModal } from "@/hooks/use-store-modal";
import {Modal} from "@/components/ui/modal";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { redirect } from "next/dist/server/api-utils";

const formSchema = z.object({
    name: z.string().min(1), //at least 1 character for name
});

//this is a StoreModal that controls the creation of a store
// this StoreModal can use hook useStoreModal which tracks and controls onclost and onopen
export const StoreModal = () =>{
    // store model hook
    const storeModal = useStoreModal(); 
    //everything should be disabled if we've already submitted the form
    const [loading,setLoading] = useState(false); 
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: ""
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) =>{
        // Create Store
        try {
           setLoading(true);


        //    values is name and userId
           const response = await axios.post('/api/stores', values);
        //    console.log(response.data);

        // this will be a popup window/alert
        // toast.success("Stoore created.");

            // why not using the router? 
            // windows.location will do a complete refresh on the page
            // the store created will be 100% loaded into the database
            window.location.assign(`/${response.data.id}`);
        } catch (error) {
            // console.log(error)
            toast.error("Something went wrong.");
        }finally{
            setLoading(false);
        }
    }

    return(
        //this is a StoreModal, still a Modal, that has a tile, a description, a isOpen status and a onClose function
        <Modal
            title="Create store"
            description="Add a new store"
            isOpen = {storeModal.isOpen}
            onClose={storeModal.onClose}
        >
            <div>
                <div className="space-y-4 py-2 pb-4">
                    <Form {...form}>
                        {/* this will use our onsubmit function */}
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                control={form.control}
                                name="name"
                                // if you don't have {} around field, it will not update in real time
                                render={({field})=>(
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            {/* spred field props into input, to handle everyting the field handles */}
                                            {/* field: onBlur .etc */}
                                            <Input disabled={loading} 
                                                    placeholder="E-Commerce" {...field}/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            {/* self closing tag for Form */}
                            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                                <Button disabled={loading}
                                        variant="outline" 
                                        onClick={storeModal.onClose}>Cancel</Button>
                                {/* this will trigger onSubmit function     */}
                                <Button disabled={loading}
                                        type="submit">Continue</Button> 
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </Modal>
    );
}