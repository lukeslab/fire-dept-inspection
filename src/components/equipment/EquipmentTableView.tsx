import { MoreHorizontal } from "lucide-react"
import { createColumnHelper } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { COMPARTMENT_GROUPS } from "@/lib/db/compartmentGroups"

import { DataTable, type DataTableFeatures } from "../application/DataTable"

import type { CompartmentsState, RigEquipment } from "../rigs/RigDialog"

interface EquipmentTableViewProps {
	equipment: RigEquipment[]
}

export function EquipmentTableView({ equipment }: EquipmentTableViewProps) {
	const columnHelper = createColumnHelper<DataTableFeatures, RigEquipment>()
	const columns = columnHelper.columns([
		columnHelper.accessor("name", {
			header: "Item Name",
		}),
		columnHelper.accessor("group_key", {
			header: "Compartment Group",
			cell: ({ row }) => {
				const group = COMPARTMENT_GROUPS.find(
					(group) => row.getValue("group_key") === group.key,
				)

				return group?.label
			},
		}),
		columnHelper.accessor("compartment_name", {
			header: "Compartment",
		}),
		columnHelper.accessor("hasfunction", {
			header: "Has Function",
		}),
		columnHelper.display({
			id: "actions",
			cell: ({ row }) => {
				const equipment = row.original

				return (
					<DropdownMenu>
						<DropdownMenuTrigger
							render={<Button variant="ghost" className="h-8 w-8 p-0" />}>
							<span className="sr-only">Open menu</span>
							<MoreHorizontal className="h-4 w-4" />
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuGroup>
								<DropdownMenuLabel>Actions</DropdownMenuLabel>
								<DropdownMenuItem onClick={() => console.log(equipment.name)}>
									Copy payment ID
								</DropdownMenuItem>
							</DropdownMenuGroup>
							<DropdownMenuSeparator />
							<DropdownMenuGroup>
								<DropdownMenuItem>View customer</DropdownMenuItem>
								<DropdownMenuItem>View payment details</DropdownMenuItem>
							</DropdownMenuGroup>
						</DropdownMenuContent>
					</DropdownMenu>
				)
			},
		}),
	])

	return (
		<>
			<DataTable data={equipment} columns={columns} />
		</>
	)
}
