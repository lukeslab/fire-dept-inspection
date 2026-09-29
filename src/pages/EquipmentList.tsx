import { useEffect, useState } from "react"

import { AppPage } from "@/components/application/AppPage"
import { PageHeader } from "@/components/application/PageHeader"
import { Spinner } from "@/components/ui/spinner"
import { FieldSet } from "@/components/ui/field"

import type { RigEquipment } from "@/components/rigs/RigDialog"

import {
	EquipmentDialog,
	type DialogModes,
} from "@/components/equipment/EquipmentDialog"
import { EquipmentTableView } from "@/components/equipment/EquipmentTableView"
import { RigDialogInventoryMobileView } from "@/components/equipment/EquipmentMobileView"

// get all equipment.
// filters by Rig, by Group
// same list as mobile view in rig?

export default function EquipmentList() {
	const [equipmentDialogIsOpen, setEquipmentDialogIsOpen] = useState(false)
	const [equipmentDialogMode, setEquipmentDialogMode] = useState<DialogModes>("create")

	const [equipment, setEquipment] = useState<RigEquipment[]>()
	const [equipmentIsLoading, setEquipmentIsLoading] = useState(true)

	useEffect(() => {
		equipmentIsLoading && loadAllEquipment()
	}, [equipment, equipmentIsLoading]) // equipment dep added incase we add a new piece it should reload.

	if (!equipment) return

	return (
		<AppPage>
			<PageHeader
				title="Equipment"
				description="Manage equipment assignments."
			/>
			<>
				{equipmentIsLoading ? (
					<Spinner />
				) : (
					<FieldSet>
						<EquipmentDialog
							mode={equipmentDialogMode}
							open={equipmentDialogIsOpen}
							onOpenChange={setEquipmentDialogIsOpen}
						/>
						{/* Mobile: below 768px */}
						<div className="md:hidden">
							<RigDialogInventoryMobileView
								equipment={equipment}
								onAddEquipment={() => {
									setEquipmentDialogIsOpen(true)
									setEquipmentDialogMode("create")
								}}
							/>
						</div>

						{/* Tablet / Desktop: above 786px */}
						<div className="hidden md:block">
							<EquipmentTableView equipment={equipment} />
						</div>
						<div>
							{/* <Pagination>
							<PaginationContent>
								<PaginationItem>
									<PaginationPrevious href="#" />
								</PaginationItem>
								<PaginationItem>
									<PaginationLink href="#">1</PaginationLink>
								</PaginationItem>
								<PaginationItem>
									<PaginationLink href="#" isActive>
										2
									</PaginationLink>
								</PaginationItem>
								<PaginationItem>
									<PaginationLink href="#">3</PaginationLink>
								</PaginationItem>
								<PaginationItem>
									<PaginationEllipsis />
								</PaginationItem>
								<PaginationItem>
									<PaginationNext href="#" />
								</PaginationItem>
							</PaginationContent>
						</Pagination> */}
						</div>
					</FieldSet>
				)}
			</>
		</AppPage>
	)

	async function loadAllEquipment() {
		const response = await fetch(`/api/equipment?all=true`)

		if (!response.ok) {
			// handle server failed error

			return
		}

		const data = await response.json()
		setEquipment(data)
		setEquipmentIsLoading(false)
	}
}
