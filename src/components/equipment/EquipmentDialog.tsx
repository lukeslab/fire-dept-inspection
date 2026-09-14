import { useState, useEffect } from "react"

import { DropdownSelectItem } from "@/components/application/DropdownSelect"

import { Spinner } from "@/components/ui/spinner"
import { Item } from "@/components/ui/item"
import { Input } from "@/components/ui/input"
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field"
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

import { COMPARTMENT_GROUPS } from "@/lib/db/compartmentGroups"

import { type Compartment } from "@/models/Compartment"
import type { Rig } from "@/models/Rig"

export type DialogModes = "view" | "edit" | "create"

interface EquipmentDialogProps {
	mode: DialogModes
	open: boolean
	rigs: Rig[]
	name?: string
	rig: Rig
	expected_quantity?: number
	compartment_name?: string
	compartment_group?: string
	onOpenChange: (open: boolean) => void
}

export function EquipmentDialog({
	mode,
	open,
	onOpenChange,
	rigs,
	name,
	rig,
	expected_quantity,
	compartment_name,
	compartment_group,
}: EquipmentDialogProps) {
	const [itemName, setItemName] = useState(name)
	const [selectedRig, setSelectedRig] = useState(rig)
	const [expectedQuantity, setExpectedQuantity] = useState(expected_quantity)
	const [compartmentGroup, setCompartmentGroup] = useState(compartment_group)
	const [compartmentName, setCompartmentName] = useState(compartment_name)

	console.log(rig)
	const DropdownSelectRigs = rigs.map((rig) => ({
		label: rig.id,
		value: rig.name,
	}))

	const DropdownSelectGroups = COMPARTMENT_GROUPS.map((group) => ({
		label: group.key,
		value: group.label,
	}))

	const DropdownselectCompartments = ""

	return (
		<>
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogContent className="w-7/8">
					<DialogHeader>
						<DialogTitle>{`${mode} Item${mode === "edit" ? name : ""}`}</DialogTitle>
					</DialogHeader>

					<FieldSet>
						<FieldGroup className="grid grid-cols-2 gap-4">
							<Field orientation="horizontal">
								{mode === "view" ? (
									<div className="flex items-center gap-3">
										<span className="text-xs uppercase tracking-wide font-semibold">
											Name
										</span>

										<p className="text-sm font-normal">{itemName}</p>
									</div>
								) : (
									<>
										<FieldLabel htmlFor="name">Name</FieldLabel>
										<Input
											id="name"
											value={itemName}
											onChange={(event) => setItemName(event.target.value)}
										/>
									</>
								)}
							</Field>

							<Field orientation="horizontal">
								{mode === "view" ? (
									<div className="flex items-center gap-3">
										<span className="text-xs uppercase tracking-wide font-semibold">
											Expected Quantity
										</span>

										<p className="text-sm font-normal">{expectedQuantity}</p>
									</div>
								) : (
									<>
										<FieldLabel htmlFor="quantity">
											Expected Quantity
										</FieldLabel>
										<Input
											id="quantity"
											value={expectedQuantity}
											onChange={(event) => setItemName(event.target.value)}
										/>
									</>
								)}
							</Field>
						</FieldGroup>
						<FieldGroup className="grid grid-cols-2 gap-4">
							{rig ? (
								<DropdownSelectItem
									defaultValue={rig.name}
									items={DropdownSelectRigs}
									disabled={true}
								/>
							) : (
								<DropdownSelectItem
									defaultValue={"Please select a Rig"}
									items={DropdownSelectRigs}
									disabled={false}
								/>
							)}
							<DropdownSelectItem
								defaultValue={"Please select a group"}
								items={DropdownSelectGroups}
								disabled={false}
							/>
							{/* <DropdownSelectItem
								defaultValue={"Please select a compartment"}
								items={DropdownSelectCompartments}
							/> */}
						</FieldGroup>
					</FieldSet>
				</DialogContent>
			</Dialog>
		</>
	)
}
