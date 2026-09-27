import { useState, useEffect } from "react"

import { Spinner } from "@/components/ui/spinner"
import { FieldSet } from "@/components/ui/field"
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination"

import { EquipmentTableView } from "../equipment/EquipmentTableView"

import type { CompartmentsState, RigEquipment } from "./RigDialog"

import { RigDialogInventoryMobileView } from "../equipment/EquipmentMobileView"

interface RigDialogInventoryTabProps {
	mode: string
	compartments: CompartmentsState
	rigId?: string
	onAddEquipment: () => void
}

export function RigDialogInventoryTab({
	rigId,
	onAddEquipment,
}: RigDialogInventoryTabProps) {
	const [equipment, setEquipment] = useState<RigEquipment[]>([])
	const [equipmentIsLoading, setEquipmentIsLoading] = useState(true)

	useEffect(() => {
		rigId && equipmentIsLoading && loadEquipmentByRigId(rigId)
	}, [rigId, equipmentIsLoading])

	return (
		<>
			{equipmentIsLoading ? (
				<Spinner />
			) : (
				<FieldSet>
					{/* Mobile: below 768px */}
					<div className="md:hidden">
						<RigDialogInventoryMobileView
							equipment={equipment}
							onAddEquipment={onAddEquipment}
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
	)

	async function loadEquipmentByRigId(rigId: string) {
		const response = await fetch(`/api/equipment?rigId=${rigId}`)

		if (!response.ok) {
			// setRequestErrors("Failed to get equipment from server.")

			return
		}

		const data = await response.json()
		console.log(data)

		// setValidationErrors([])
		setEquipment(data)
		setEquipmentIsLoading(false)
	}
}
