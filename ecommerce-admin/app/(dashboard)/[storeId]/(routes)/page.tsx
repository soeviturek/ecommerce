import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import prismadb
 from "@/lib/prismadb";
interface DashboardPageProps{
    params:{storeId:string}
};
const DashboardPage: React.FC<DashboardPageProps> = async ({
    params
})=>{
    // const store = await prismadb.store.findFirst({
    //     where: {
    //         id: params.storeId
    //     }
    // });
    // return(
    //     <div>
    //         Active Store: {store?.name}
    //     </div>
    // );
    return (
        <div className="flex-col">
            <div className="flex-col space-y-4 p-8 pt-6">
                <Heading title="Dashboard" description="Overview of your store" />
                <Separator/>
                <div className="grid gap-4 grid-cols-3">
                    
                </div>
            </div>
        </div>
    )
}
export default DashboardPage;