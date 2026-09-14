import { useState, useMemo } from "react"
import { Package, PlusCircleIcon, Trash2, EllipsisVertical } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuItem,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemGroup,
	ItemMedia,
	ItemTitle,
} from "@/components/ui/item"

import { DropdownMenuFilter } from "@/components/application/DropdownMenuFilter"
// import { EquipmentDialog } from "@/components/equipment/EquipmentDialog"

import { COMPARTMENT_GROUPS } from "@/lib/db/compartmentGroups"

import type { RigEquipment } from "./RigDialog"

interface RigDialogInventoryMobileViewProps {
	equipment: RigEquipment[]
	onAddEquipment: () => void
}

export interface FilterMenuOption {
	key: string
	label: string
	checked: boolean
}

export function RigDialogInventoryMobileView({
	equipment,
	onAddEquipment,
}: RigDialogInventoryMobileViewProps) {
	const [filterMenuOptions, setFilterMenuOptions] = useState<
		FilterMenuOption[]
	>(
		COMPARTMENT_GROUPS.map((group) => ({
			key: group.key,
			label: group.label,
			checked: true,
		})),
	)

	const filteredEquipment = useMemo(() => {
		return equipment.filter((item) => {
			return filterMenuOptions.find(
				(menuOption) => menuOption.checked && item.group_key === menuOption.key,
			)
		})
	}, [filterMenuOptions, equipment])

	// const [equipmentDialogIsOpen, setEquipmentDialogIsOpen] = useState(false)

	if (equipment.length === 0) {
		return (
			<div className="rounded-lg border border-dashed p-8 text-center">
				<p className="font-medium">No equipment assigned</p>

				<p className="mt-1 text-sm text-muted-foreground">
					Add equipment to this rig to get started.
				</p>
			</div>
		)
	}

	return (
		<>
			{/* <EquipmentDialog
				open={equipmentDialogIsOpen}
				onOpenChange={setEquipmentDialogIsOpen}
			/> */}

			{/* <div className={`${equipmentDialogIsOpen && "blur-xs"}`}> */}
			<ItemGroup className="flex flex-row mb-5">
				<ItemTitle>Search:</ItemTitle>
				<Input
					className="w-fit border-gray-300 rounded-sm border-1 pl-2"
					type="search"
					placeholder="Enter item name..."
				/>
				<Button
					className="rounded-sm border-1 bg-red-700"
					onClick={onAddEquipment}>
					<PlusCircleIcon /> Add
				</Button>
			</ItemGroup>
			<ItemGroup className="flex flex-row mt-5 mb-5">
				<ItemTitle>Filters:</ItemTitle>
				<DropdownMenuFilter
					menuLabel={"Groups"}
					filterMenuOptions={filterMenuOptions}
					setFilterMenuOptions={setFilterMenuOptions}
				/>
			</ItemGroup>
			<ItemGroup className="flex gap-2">
				{filteredEquipment.map((item) => {
					const groupLabel =
						COMPARTMENT_GROUPS.find((group) => group.key === item.group_key)
							?.label ?? item.group_key

					return (
						<ItemGroup className="flex-row items-center">
							<Item
								key={item.id}
								variant="outline"
								size="sm"
								className="items-center">
								<ItemMedia variant="icon">
									<Package className="size-4" />
								</ItemMedia>

								<ItemContent className="min-w-0">
									<ItemTitle className="truncate">{item.name}</ItemTitle>

									<ItemDescription className="truncate">
										{groupLabel}

										<span className="px-1" aria-hidden="true">
											→
										</span>

										{item.compartment_name}
									</ItemDescription>
								</ItemContent>

								<ItemActions className="shrink-0">
									<Badge variant="secondary" className="whitespace-nowrap">
										Qty {item.expected_quantity}
									</Badge>
									<DropdownMenu>
										<DropdownMenuTrigger
											nativeButton={false}
											render={<EllipsisVertical />}></DropdownMenuTrigger>
										<DropdownMenuContent>
											<DropdownMenuGroup>
												<DropdownMenuItem>Edit</DropdownMenuItem>
												<DropdownMenuItem variant="destructive">
													Delete
												</DropdownMenuItem>
											</DropdownMenuGroup>
										</DropdownMenuContent>
									</DropdownMenu>
								</ItemActions>
							</Item>
						</ItemGroup>
					)
				})}
				<Button className="rounded-sm border-1 bg-red-700">
					<PlusCircleIcon /> Add Equipment
				</Button>
			</ItemGroup>
			{/* </div> */}
		</>
	)
}
