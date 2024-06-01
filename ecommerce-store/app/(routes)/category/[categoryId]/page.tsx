import getCategory from "@/actions/get-category";
import getColours from "@/actions/get-colours";
import getProducts from "@/actions/get-products";
import getSizes from "@/actions/get-sizes";
import Billboard from "@/components/billboard";
import Container from "@/components/ui/container";

export const revaliadte = 0;

interface CategoryPageProps{
    params:{
        categoryId:string;
    },
    searchParams:{
        colourId:string;
        sizeId: string;
    }
}

const CategoryPage:React.FC<CategoryPageProps> = async ({params,searchParams}) => {
    const products = await getProducts({categoryId: params.categoryId,
        colourId: searchParams.colourId,
        sizeId: searchParams.sizeId
    });
    const sizes = await getSizes();
    const colours = await getColours();
    const category = await getCategory(params.categoryId);
    return ( 
        <div className="bg-white">
            <Container>
                <Billboard data={category.billboard} />
            </Container>
        </div>
     );
}
 
export default CategoryPage;