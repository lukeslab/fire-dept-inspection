import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuItem,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import type { FilterMenuOption } from "@/components/equipment/EquipmentMobileView"

interface DropdownMenuFilterProps {
	menuLabel: string
	filterMenuOptions: FilterMenuOption[]
	setFilterMenuOptions: React.Dispatch<React.SetStateAction<FilterMenuOption[]>>
}

export function DropdownMenuFilter({
	menuLabel,
	filterMenuOptions,
	setFilterMenuOptions,
}: DropdownMenuFilterProps) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={
					<Button
						className="border-gray-300 rounded-sm border"
						variant="outline">
						{menuLabel}
					</Button>
				}
			/>
			<DropdownMenuContent className="w-40">
				<DropdownMenuGroup>
					<DropdownMenuLabel>Select 1 or more options</DropdownMenuLabel>
					<DropdownMenuGroup className="flex-row">
						<DropdownMenuItem
							className="inline text-gray-400 underline"
							render={
								<Button
									className="bg-white"
									onClick={() =>
										setFilterMenuOptions((previousOptions) => {
											return previousOptions.map((previousOption) => {
												return { ...previousOption, checked: true }
											})
										})
									}>
									Select All
								</Button>
							}
						/>
						<DropdownMenuItem
							variant="destructive"
							className="inline underline"
							render={
								<Button
									className="bg-white"
									onClick={() =>
										setFilterMenuOptions((previousOptions) => {
											return previousOptions.map((previousOption) => {
												return { ...previousOption, checked: false }
											})
										})
									}>
									Clear
								</Button>
							}
						/>
					</DropdownMenuGroup>
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
