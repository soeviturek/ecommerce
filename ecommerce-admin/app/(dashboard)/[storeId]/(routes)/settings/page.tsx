import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";
// this . means we are accessing the current level components directory, not the root directory
import { SettingsForm } from "./components/settings-form";

interface SettingsPageProps{
    params:{
        storeId:string;
    }
};

const SettingsPage: React.FC<SettingsPageProps> =  async ({params}) => {
    const {userId} = auth();
    if (!userId){
        redirect('/signin');
    }
    const store = await prismadb.store.findFirst({
        where:{
            id : params.storeId,
            userId
        }
    })

    // protect against random store id
    if(!store){
        redirect('/');
    }

    return ( 
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <SettingsForm initialData={store}/>
            </div>
        </div>
        
     );
}
 
export default SettingsPage;