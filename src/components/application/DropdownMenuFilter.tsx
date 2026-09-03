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

interface DropdownMenuCheckboxesProps {
	menuLabel: string
	menuOptions: { key: string; label: string }
	onChange: (value: string) => void
}

export function DropdownMenuCheckboxes({
	menuLabel,
	menuOptions,
	onChange,
}): DropdownMenuCheckboxesProps {
	const [showStatusBar, setShowStatusBar] = useState(true)
	const [showActivityBar, setShowActivityBar] = useState(false)
	const [showPanel, setShowPanel] = useState(false)

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={<Button variant="outline">{menuLabel}</Button>}
			/>
			<DropdownMenuContent className="w-40">
				<DropdownMenuGroup>
					<DropdownMenuLabel>Select 1 or more options</DropdownMenuLabel>
					{menuOptions.map((option) => {
						return (
							<DropdownMenuCheckboxItem
								key={option.key}
								checked={showStatusBar ?? false}
								onCheckedChange={onChange}>
								{option.label}
							</DropdownMenuCheckboxItem>
						)
					})}
					{/* <DropdownMenuCheckboxItem
						checked={showActivityBar}
						onCheckedChange={setShowActivityBar}
						disabled>
						Activity Bar
					</DropdownMenuCheckboxItem>
					<DropdownMenuCheckboxItem
						checked={showPanel}
						onCheckedChange={setShowPanel}>
						Panel
					</DropdownMenuCheckboxItem> */}
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
