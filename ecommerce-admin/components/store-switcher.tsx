"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useStoreModal } from "@/hooks/use-store-modal";
import { Store } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, PlusCircle, Store as StoreIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";


type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>;

interface StoreSwitcherProps extends PopoverTriggerProps{
    items : Store[];
};

export default function StoreSwitcher({
    className,
    items = []
}:StoreSwitcherProps){
    const storeModal = useStoreModal();
    const params = useParams();
    const router = useRouter();

    // format items, form a array to be used in popover
    const formattedItems = items.map((item)=>({
        label:item.name,
        value:item.id
    }));
    // get current active store, find same id as the same id in url
    const currentStore = formattedItems.find((item)=>item.value === params.storeId);

    // triggers when click on different store
    const [open,setOpen] = useState(false);

    const onStoreSelect = (store: {value: string, label: string})=>{
        //close popover
        setOpen(false);
        //redirect to store id
        router.push(`/${store.value}`);
    }
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline"
                size="sm"
                role="combobox"
                // accessibility
                aria-expanded={open}
                aria-label="Select a store"
                className={cn("w-[200px] justify-between",className)}>
                    {/* margin right 2 */}
                    <StoreIcon className="mr-2 h-4 w-4" />

                    {currentStore?.label}
                    {/* expand arrow icon */}
                    <ChevronsUpDown className="ml-auto h-4 w-4 shrin-0 opacity-50"/>
                </Button>
            </PopoverTrigger>

            {/* popover content
            When clicking on the popover, there is an command input to search store
            Then there will be a command group that iterates all the stores in the map,
            It checks if the current select store value===the store's value, if yes opacity=100(visible), otherwise 0 */}
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandList>
                        <CommandInput placeholder="Search store..." />
                        <CommandEmpty>No store found.</CommandEmpty>
                        <CommandGroup heading="Stores">
                            {formattedItems.map((store)=>(
                                <CommandItem 
                                    key={store.value}
                                    onSelect={()=>onStoreSelect(store)}
                                    className="text-sm"
                                >
                                    <StoreIcon className="mr-2 h-4 w-4" />
                                    {store.label}
                                    <Check
                                        className={cn(
                                        "ml-auto h-4 w-4",
                                        currentStore?.value===store.value
                                        ? "opacity-100"
                                        :"opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                    <CommandSeparator />
                    <CommandList>
                        <CommandGroup>
                            <CommandItem
                                onSelect={()=>{
                                    console.log("selected");
                                    setOpen(false);
                                    storeModal.onOpen();
                                }}
                            >
                                <PlusCircle className="mr-2 h-5 w-5"/>
                                Create Store

                            </CommandItem>
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );

};