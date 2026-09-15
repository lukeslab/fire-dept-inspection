import { useState, useMemo } from "react"

import { Button } from "@/components/ui/button"
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"

export interface SelectOption {
	label: string
	value: string
}

interface DropdownSelectItemProps {
	defaultValue: string
	items: SelectOption[]
	disabled?: boolean
	onValueChange?: (item: SelectOption | undefined) => void
}

export function DropdownSelectItem({
	defaultValue,
	items,
	disabled = false,
	onValueChange,
}: DropdownSelectItemProps) {
	return (
		<Select
			defaultValue={defaultValue}
			disabled={disabled}
			onValueChange={(value) => {
				if (value) {
					const selectedItem = items.find((item) => item.value === value)

					onValueChange?.(selectedItem)
				}
			}}>
			<SelectTrigger>
				<SelectValue />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					{items.map((item) => (
						<SelectItem key={item.label} value={item.value}>
							{item.value}
						</SelectItem>
					))}
				</SelectGroup>
			</SelectContent>
		</Select>
	)
}
