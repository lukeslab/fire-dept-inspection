import { MoreHorizontal } from "lucide-react"
import { createColumnHelper } from "@tanstack/react-table"

import { Spinner } from "@/components/ui/spinner"
import {
	Field,
	FieldLegend,
	//   FieldDescription,
	FieldGroup,
	FieldLabel,
	//   FieldSeparator,
	//   FieldLegend,
	FieldSet,
} from "@/components/ui/field"
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

import type { CompartmentsState, RigEquipment } from "./RigDialog"
import {
	type DataTableFeatures,
	DataTable,
} from "./RigDialogEquipmentTabDataTable"

interface RigDialogEquipmentTabProps {
	mode: string
	compartments: CompartmentsState
	equipment: RigEquipment[]
	equipmentIsLoading: boolean
}

export function RigDialogEquipmentTab({
	mode,
	compartments,
	equipment,
	equipmentIsLoading,
}: RigDialogEquipmentTabProps) {
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

				return <div>{group.label}</div>
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
			{equipmentIsLoading ? (
				<Spinner />
			) : (
				<FieldSet>
					<FieldLegend>Assigned Equipment</FieldLegend>
					<DataTable columns={columns} data={equipment} />
					{/* <Table>
						<TableHeader>
							<TableRow>
								<TableHead>Equipment</TableHead>
								<TableHead>Compartment Group</TableHead>
								<TableHead>Compartment</TableHead>
								<TableHead>Has Function</TableHead>
								<TableHead>Expected Quantity</TableHead>
								{mode === "edit" && <TableHead>Actions</TableHead>}
							</TableRow>
						</TableHeader>
						<TableBody>
							{equipment.map((equipment) => {
								const group = COMPARTMENT_GROUPS.find(
									(group) => equipment.group_key === group.key,
								)

								return (
									<TableRow>
										<TableCell>{equipment.name}</TableCell>
										<TableCell>{`${group.label} `}</TableCell>
										<TableCell>{`${equipment.compartment_name}`}</TableCell>
										<TableCell>
											{equipment.hasfunction ? "Yes" : "No"}
										</TableCell>
										<TableCell>{}</TableCell>
									</TableRow>
								)
							})}
						</TableBody>
					</Table> */}
					{/* {
						COMPARTMENT_GROUPS.map((group) => {
							return (
								<Item className="border-1 border-mist-100 p-0 rounded-l">
									<ItemHeader className="bg-mist-100 p-2 rounded-l">
										{group.label}
									</ItemHeader>
									<ItemContent>
										<Table>
											<TableHeader>
												<TableRow>
													<TableHead>Compartment</TableHead>
													<TableHead>Equipment</TableHead>
													<TableHead>Functional</TableHead>
													<TableHead>Quantity</TableHead>
													{mode === "edit" && <TableHead>Actions</TableHead>}
												</TableRow>
											</TableHeader>
											<TableBody>
												{equipment.map((equipment) => {
													
													if (equipment.group_key === group.key ) {
														return (
															<TableRow>
																<TableCell>{equipment.compartment_name}</TableCell>
																<TableCell>{equipment.name}</TableCell>
																<TableCell>
																	{equipment.hasfunction ? "test" : "N/A"}
																</TableCell>
																<TableCell>{}</TableCell>
															</TableRow>
														)
													}

												})}
											</TableBody>
										</Table>
									</ItemContent>
								</Item>
							)
						})
					} */}
				</FieldSet>
			)}
		</>
	)
}
