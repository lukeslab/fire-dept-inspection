import { MoveRight } from "lucide-react"

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion"
import { Spinner } from "@/components/ui/spinner"
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import {
	Item,
	ItemHeader,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemMedia,
	ItemTitle,
} from "@/components/ui/item"
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
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { COMPARTMENT_GROUPS } from "@/lib/db/compartmentGroups"

import { type Rig } from "@/models/Rig"

import type { CompartmentsState, RigEquipment } from "./RigDialog"

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
	return (
		<>
			{equipmentIsLoading ? (
				<Spinner />
			) : (
				<FieldSet>
					<FieldLegend>Assigned Equipment</FieldLegend>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Equipment</TableHead>
								<TableHead>Compartment</TableHead>
								<TableHead>Functional</TableHead>
								<TableHead>Quantity</TableHead>
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
										<TableCell>
											{`${group.label} `}
											<MoveRight strokeWidth="1px" className="inline" />{" "}
											{`${equipment.compartment_name}`}
										</TableCell>
										<TableCell>
											{equipment.hasfunction ? "Yes" : "No"}
										</TableCell>
										<TableCell>{}</TableCell>
									</TableRow>
								)
							})}
						</TableBody>
					</Table>
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
