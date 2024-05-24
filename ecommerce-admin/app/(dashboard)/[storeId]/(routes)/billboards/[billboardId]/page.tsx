import prismadb from "@/lib/prismadb";
import { BillboardForm } from "./compoments/billboard-form";

const BillboardPage =  async ({
    params
}:{
    params:{billboardId:string}
}) => {
    const billboard = await prismadb.billboard.findUnique(
        {
            where:{
                id: params.billboardId
            }
        }
    );


    return (
        // whether the billboard is found in database, we are going to display 
        // either display create new form or edit existing form (update).

    <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
            <BillboardForm  initialData={billboard}/>
        </div>
        {/* Existing Billboard:{billboard?.label} */}
    </div>
    );
}
export default BillboardPage;