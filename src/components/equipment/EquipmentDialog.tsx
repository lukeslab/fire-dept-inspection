import { useState, useMemo } from "react"

import { DropdownSelectItem } from "@/components/application/DropdownSelect"

import { Input } from "@/components/ui/input"
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field"
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

import { COMPARTMENT_GROUPS } from "@/lib/db/compartmentGroups"
import { useRigs } from "@/hooks/hooks"
import { useRig } from "@/hooks/useRig"

import type { Rig } from "@/models/Rig"

import type { SelectOption } from "@/components/application/DropdownSelect"

export type DialogModes = "view" | "edit" | "create"

interface EquipmentDialogProps {
	mode: DialogModes
	open: boolean
	rigs?: Rig[]
	name?: string
	rig?: Rig
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
}: EquipmentDialogProps) {
	const [itemName, setItemName] = useState(name)
	const [chosenRigId, setChosenRigId] = useState<string | undefined>()
	const selectedRigId = rig?.id ?? chosenRigId
	const [expectedQuantity, setExpectedQuantity] = useState(expected_quantity)
	const [selectedGroup, setSelectedGroup] = useState<SelectOption | null>(null)
	const [selectedCompartment, setSelectedCompartment] =
		useState<SelectOption | null>(null)

	// Hooks are always called. Their enabled flags determine which requests run.
	const { rigs: fetchedRigs, error: rigsError } = useRigs(open && !rig && !rigs)
	const { rig: fetchedRig, isLoading: rigIsLoading, error: rigError } =
		useRig(selectedRigId, open && !!selectedRigId && rig?.id !== selectedRigId)
	const availableRigs = rigs ?? fetchedRigs
	const selectedRig = rig?.id === selectedRigId
		? rig
		: fetchedRig?.id === selectedRigId ? fetchedRig : null

	const selectRigOptions: SelectOption[] = availableRigs.map((rig) => ({
		label: rig.id,
		value: rig.name,
	}))

	const selectGroupOptions = COMPARTMENT_GROUPS.map((group) => ({
		label: group.key,
		value: group.label,
	}))

	const selectCompartmentOptions: SelectOption[] = useMemo(() => {
		if (!selectedGroup || !selectedRig) return []

		const compartments = selectedRig.compartments.filter(
			(compartment) => compartment.group_key === selectedGroup.label,
		)

		return compartments.map((compartment) => {
			return {
				label: compartment.id,
				value: compartment.name,
			}
		})
	}, [selectedGroup, selectedRig])

	const [hasFunction, setHasFunction] = useState(false)

	return (
		<>
			<Dialog open={open} onOpenChange={(nextOpen) => {
				if (!nextOpen) {
					setChosenRigId(undefined)
					setSelectedGroup(null)
					setSelectedCompartment(null)
				}
				onOpenChange(nextOpen)
			}}>
				<DialogContent className="w-7/8">
					<DialogHeader>
						<DialogTitle>{`${mode} Item${mode === "edit" ? name : ""}`}</DialogTitle>
					</DialogHeader>

					<FieldSet>
						<FieldGroup className="grid grid-cols-2 gap-4 space-y-5">
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
											type="number"
											id="quantity"
											value={expectedQuantity}
											onChange={(event) => setItemName(event.target.value)}
										/>
									</>
								)}
							</Field>

							{/* If coming from rigDialog, preset the rig dropdown to the selected Rig and disable. */}
							{rig ? (
								<DropdownSelectItem
									defaultValue={rig.name}
									items={[{ label: rig.id, value: rig.name }]}
									disabled={true}
								/>
							) : (
								<DropdownSelectItem
									defaultValue={""}
									placeholder="Select rig"
									items={selectRigOptions}
									onValueChange={(option) => {
										setChosenRigId(option?.label)
										setSelectedGroup(null)
										setSelectedCompartment(null)
									}}
								/>
							)}
							{rigsError && <p className="text-destructive">{rigsError}</p>}
							{rigError && <p className="text-destructive">{rigError}</p>}
							{rigIsLoading && <p>Loading compartments...</p>}

							{selectedRig && <DropdownSelectItem
								key={selectedRigId}
								defaultValue={"Select group"}
								items={selectGroupOptions}
								onValueChange={(option) => {
									setSelectedGroup(option ?? null)
									setSelectedCompartment(null)
								}}
							/>}
							{selectedGroup && (
								<DropdownSelectItem
									key={`${selectedRigId}-${selectedGroup.label}`}
									placeholder={"Select compartment"}
									defaultValue={""}
									items={selectCompartmentOptions}
									onValueChange={(option) => setSelectedCompartment(option ?? null)}
								/>
							)}

							<div className="flex items-center space-x-3">
								<Label htmlFor="has_function">Has Function?</Label>
								<Switch
									id="has_function"
									onCheckedChange={() =>
										setHasFunction((previousValue) => !previousValue)
									}
								/>
							</div>
						</FieldGroup>
						<FieldGroup className="flex-row justify-center">
							<Button type="submit">Submit</Button>
							<Button variant="secondary">Cancel</Button>
						</FieldGroup>
					</FieldSet>
				</DialogContent>
			</Dialog>
		</>
	)
}
