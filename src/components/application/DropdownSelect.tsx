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

interface DropdownSelectItemProps {
	defaultValue: string
	items: { label: string; value: string }[]
	disabled: boolean
}

export function DropdownSelectItem({
	defaultValue,
	items,
	disabled,
}: DropdownSelectItemProps) {
	return (
		<Select defaultValue={defaultValue} disabled={disabled}>
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
