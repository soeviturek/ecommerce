import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";


export default async function SetupLayout({
    children}
    :{children:React.ReactNode;
}) {
    const {userId} = auth();
    if(!userId){
        redirect('/sign-in');
    }

    const store =await prismadb.store.findFirst({
        where:{
            userId
        }
    });
    if (store){
        // redirect to that [storeId] route. Then redirected to dashboard
        // then the dashboard will check again, then render the navigation bar and children
        redirect(`/${store.id}`);
    }
    return (
        <>
            {children}
        </>
    )

}