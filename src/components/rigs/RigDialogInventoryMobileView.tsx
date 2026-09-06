import { useState, useMemo } from "react"
import { Package } from "lucide-react"

import { Badge } from "@/components/ui/badge"

import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemGroup,
	ItemMedia,
	ItemTitle,
} from "@/components/ui/item"

import { DropdownMenuCheckboxes } from "@/components/application/DropdownMenuFilter"

import { COMPARTMENT_GROUPS } from "@/lib/db/compartmentGroups"
import type { RigEquipment } from "./RigDialog"

interface RigDialogInventoryMobileViewProps {
	equipment: RigEquipment[]
}

export interface FilterMenuOption {
	key: string
	label: string
	checked: boolean
}

export function RigDialogInventoryMobileView({
	equipment,
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

	// const menuOptions = [...filterMenuOptions]

	const filteredEquipment = useMemo(() => {
		if (filterMenuOptions.length === COMPARTMENT_GROUPS.length) return equipment

		return equipment.filter((item) => {
			filterMenuOptions.find((menuOption) => item.group_key === menuOption.key)
		})
	}, [filterMenuOptions, equipment])

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
			<ItemGroup>
				<DropdownMenuCheckboxes
					menuLabel={"Compartment Groups"}
					filterMenuOptions={filterMenuOptions}
					setFilterMenuOptions={setFilterMenuOptions}
				/>
			</ItemGroup>
			<ItemGroup className="gap-2">
				{filteredEquipment.map((item) => {
					const groupLabel =
						COMPARTMENT_GROUPS.find((group) => group.key === item.group_key)
							?.label ?? item.group_key

					return (
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
							</ItemActions>
						</Item>
					)
				})}
			</ItemGroup>
		</>
	)
}
