"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ProductColumn = {
  id: string
  name: string
  isFeatured: boolean,
  isArchived: boolean,
  price: string,
  category: string,
  size: string,
  colour:string,
  createdAt:string,
}
export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "isArchived",
    header: "Archived",
  },
  {
    accessorKey: "isFeatured",
    header: "Featured",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "size",
    header: "Size",
  },
  {
    accessorKey: "colour",
    header: "Colour",
    cell:({row}) =>(<div className="flex items-center gap-x-2">
      {row.original.colour}
      <div 
        className="h-6 w-6 rounded-full border" 
        style={{backgroundColor:row.original.colour}}
      />
    </div>)
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id:"actions",
    cell:({row}) => <CellAction data={row.original} />
  }
]
