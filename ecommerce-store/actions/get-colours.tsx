import {Colour} from "@/types"

const URL = `${process.env.NEXT_PUBLIC_API_URL}/colours`;


const getColours = async (): Promise<Colour[]> =>{
    const res = await fetch(URL
);
    return res.json();
};

export default getColours;