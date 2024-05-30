import Link from "next/link";
import Container from "./ui/container";
import MainNav from "./mainNav";


const Navbar = ()=>{
    return(
        <div className="border-b">
            <Container>
                <div className="relatiove px-4 sm:px-6 lg:px-8 flex h-16 items-center">
                <Link href="/" className="ml-4 lfex lg:ml-0 gap-x-2">
                    <p className="font-bold text-xl">STORE</p>
                </Link>
                {/* render routes */}
                <MainNav />
                </div>
                Navbar!
            </Container>
            
        </div>
    )
}
export default Navbar;