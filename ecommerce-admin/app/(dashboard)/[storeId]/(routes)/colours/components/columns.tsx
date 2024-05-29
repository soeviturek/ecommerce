"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ColourColumn = {
  id: string
  name: string
  value: string
  createdAt:string;
}

export const columns: ColumnDef<ColourColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "value",
    header: "Value",
    cell:({row})=>(
      <div className="flex items-center gap-x-2">
        {row.original.value}
        {/* If you use dynamic classes e.g. bg-[${..}], there is a chance that tailwind will not compile this*/}
        <div className="h-6 w-6 rounded-fulll border" style={{backgroundColor: row.original.value}}/>
      </div>
    )
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
