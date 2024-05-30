import { cn } from "@/lib/utils";
import { forwardRef } from "react";
/** This is just for Store page..
 *  Get more freedom for button than shadcnui Button. Maybe if you know
 *  shadcnui better in the future you can replace this.
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>{}

const Button = forwardRef<HTMLButtonElement,ButtonProps>(({
    className,
    children,
    disabled,
    type="button",
    ...props
},ref)=>{
return(
    // class name will override any of the classes here using other custom className
    <button className={cn("w-auto rounded-full bg-black border-transparent px-5 py-3 disabled:cursor-not-allowed disabled:opacity-50 text-white font-semibold hover:opacity-75 transition",className)} ref={ref}>
        {children}
    </button>
)
});

Button.displayName="Button";

export default Button;