import { useState, useMemo } from "react"

import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import type { FilterMenuOption } from "@/components/rigs/RigDialogInventoryMobileView"

interface DropdownMenuCheckboxesProps {
	menuLabel: string
	filterMenuOptions: FilterMenuOption[]
	setFilterMenuOptions: React.Dispatch<React.SetStateAction<FilterMenuOption[]>>
}

export function DropdownMenuCheckboxes({
	menuLabel,
	filterMenuOptions,
	setFilterMenuOptions,
}: DropdownMenuCheckboxesProps) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={<Button variant="outline">{menuLabel}</Button>}
			/>
			<DropdownMenuContent className="w-40">
				<DropdownMenuGroup>
					<DropdownMenuLabel>Select 1 or more options</DropdownMenuLabel>
					{filterMenuOptions.map((option) => {
						return (
							<DropdownMenuCheckboxItem
								key={option.key}
								checked={option.checked}
								onCheckedChange={(checked) => {
									setFilterMenuOptions((previousOptions) => {
										return previousOptions.map((previousOption) => {
											return option.key === previousOption.key
												? { ...previousOption, checked }
												: previousOption
										})
									})
								}}>
								{option.label}
							</DropdownMenuCheckboxItem>
						)
					})}
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
