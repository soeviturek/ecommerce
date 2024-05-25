"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

export function MainNav({
    className,
    ...props
}:React.HTMLAttributes<HTMLElement>){
    const pathname = usePathname();
    const params = useParams();

    const routes = [
        {
            href:`/${params.storeId}`,
            label:'Overview',
            active:pathname==`/${params.storeId}`,
        },
        {
            href:`/${params.storeId}/billboards`,
            label:'Billboards',
            active:pathname==`/${params.storeId}/billboards`,
        },
        {
        // Navbar is used in storeId layout, so we ave access to it
        href: `/${params.storeId}/settings`,
        label: 'Settings',
        active: pathname === `/${params.storeId}/settings`,
    },];

    // This will make Settings grey, black when hover on. Redirect to storeid/settings when clicked 
    return (
        // this cn() will merge the classname we have along with the default values
        <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}
        >
            {routes.map((route)=>(
                <Link
                    key={route.href}
                    href={route.href}
                    className={
                        cn("text-sm front-medium transition-colors hover:text-primary",
                        route.active ? "text-black dark:text-white" : "text-muted-foreground"
                    )}>
                        {route.label}
                </Link>
        ))}
        
        </nav>
    )
};