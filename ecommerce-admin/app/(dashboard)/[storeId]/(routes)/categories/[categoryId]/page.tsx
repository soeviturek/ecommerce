import prismadb from "@/lib/prismadb";
import { CategoryForm } from "./compoments/category-form";

const CategoryPage =  async ({
    params
}:{
    params:{categoryId:string,storeId:string}
}) => {
    const category = await prismadb.category.findUnique(
        {
            where:{
                id: params.categoryId
            }
        }
    );
    const billboards = await prismadb.billboard.findMany(
        {
            where:{
                storeId:params.storeId
            }
        }
    );


    return (
        // whether the billboard is found in database, we are going to display 
        // either display create new form or edit existing form (update).

    <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
            <CategoryForm  billboards={billboards} initialData={category}/>
        </div>
        {/* Existing Billboard:{billboard?.label} */}
    </div>
    );
}
export default CategoryPage;