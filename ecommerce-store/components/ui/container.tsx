interface ContainerProps{
    children:React.ReactNode;
}

const Container:React.FC<ContainerProps> = ({children}) =>{
    return(
        // set a limit for how much a container can show
        <div className="mx-auto max-w-7xl">
            {children}
        </div>
    )
}

export default Container;