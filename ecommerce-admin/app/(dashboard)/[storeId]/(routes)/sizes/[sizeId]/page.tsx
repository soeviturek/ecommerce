import prismadb from "@/lib/prismadb";
import { SizeForm } from "./compoments/billboard-form";

const SizePage =  async ({
    params
}:{
    params:{sizeId:string}
}) => {
    const size = await prismadb.size.findUnique(
        {
            where:{
                id: params.sizeId
            }
        }
    );


    return (
        // whether the billboard is found in database, we are going to display 
        // either display create new form or edit existing form (update).

    <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
            <SizeForm  initialData={size}/>
        </div>
        {/* Existing Billboard:{billboard?.label} */}
    </div>
    );
}
export default SizePage;