import prismadb from "@/lib/prismadb";
import { ColourForm } from "./compoments/colour-form";

const ColourPage =  async ({
    params
}:{
    params:{colourId:string}
}) => {
    const colour = await prismadb.colour.findUnique(
        {
            where:{
                id: params.colourId
            }
        }
    );


    return (
        // whether the billboard is found in database, we are going to display 
        // either display create new form or edit existing form (update).

    <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
            <ColourForm  initialData={colour}/>
        </div>
        {/* Existing Billboard:{billboard?.label} */}
    </div>
    );
}
export default ColourPage;