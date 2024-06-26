//this is not an ui, just one spesific layout
import { UserButton, auth } from "@clerk/nextjs";
import { MainNav } from "@/components/main-nav"; //deconstruct this because we export the constant/function
import StoreSwitcher from "./store-switcher";
import prismadb from "@/lib/prismadb";
import { redirect } from "next/navigation";
import { ModeToggle } from "./theme-toggle";

const Navbar = async () => {
    //from clerk
    const {userId} = auth();
    if (!userId){
        redirect("/sign-in");
    }
    //get all the sotres of the user
    const stores = await prismadb.store.findMany({
        where:{
            userId,
        },
    });

    return ( 
        //creates a border
        <div className="border-b"> 
            {/* height of 16, centre aligned */}
            <div className="flex h-16 items-center px-4">
                {/* pass in the stores into store switch */}
                <StoreSwitcher items={stores} />
                <MainNav className="mx-6"/>
                {/* aligned to the left, centrede, space of 4 */}
                <div className="ml-auto flex items-center space-x-4">
                    <ModeToggle/>
                    <UserButton afterSignOutUrl="/" />
                </div>

            </div>
        </div>
     );
}
 
export default Navbar;