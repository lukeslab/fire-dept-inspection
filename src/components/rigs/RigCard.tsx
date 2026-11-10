import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemMedia,
	ItemTitle,
} from "@/components/ui/item"

import type { Rig } from "@/models/Rig"

import { DeleteRigDialog } from "./DeleteRigDialog"
import { RigDialog } from "./RigDialog"

interface RigCardProps {
	rig: Rig
	rigs: Rig[]
	onDeleteError: (message: string) => void
	loadRigs: () => void
}

export function RigCard({ rig, rigs, onDeleteError, loadRigs }: RigCardProps) {
	const navigate = useNavigate()

	const [isDeleting, setIsDeleting] = useState(false)
	const [isConfirmOpen, setIsConfirmOpen] = useState(false)
	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const [imageLoading, setImageLoading] = useState(true)

	const [isCreatingNewInspection, setIsCreatingNewInspection] = useState(false)

	// useEffect(() => {
	// 	if (isInspectStarted)
	// 		startInspection(rig.id, "01550b4f-edc9-449f-8005-a8032bcbd4ca")
	// }, [isInspectStarted])

	return (
		<>
			{isDialogOpen && (
				<RigDialog
					mode="view"
					open={isDialogOpen}
					onOpenChange={setIsDialogOpen}
					rigs={rigs}
					rigId={rig.id}
					loadRigs={loadRigs}
				/>
			)}

			<DeleteRigDialog
				rig={rig}
				open={isConfirmOpen}
				onOpenChange={setIsConfirmOpen}
				deleteRig={deleteRig}
			/>

			<Item key={rig.id} role="listitem" className="items-stretch py-4">
				<ItemMedia className="w-52 shrink-0 self-stretch">
					{imageLoading && <Spinner />}
					<img
						src={rig.image_url}
						alt={`image of ${rig.name}`}
						className="h-full w-full object-contain"
						loading="lazy"
						onLoad={() => setImageLoading(false)}
					/>
				</ItemMedia>
				<ItemContent>
					<ItemTitle>{rig.name}</ItemTitle>
					<ItemDescription>Description for {rig.name}</ItemDescription>
				</ItemContent>
				<ItemActions>
					<Button
						disabled={isCreatingNewInspection}
						onClick={() => startNewInspection(rig.id)}>
						{isCreatingNewInspection ? "Please wait..." : "Inspect"}
					</Button>
					<Button variant="secondary" onClick={() => setIsDialogOpen(true)}>
						View
					</Button>
				</ItemActions>
			</Item>
		</>
	)

	async function startNewInspection(rigId) {
		// need to make this dynamic based on user session / log in
		const inspectorId = "01550b4f-edc9-449f-8005-a8032bcbd4ca"

		setIsCreatingNewInspection(true)

		try {
			const options = {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					rigId,
					inspectorId,
				}),
			}

			const response = await fetch("/api/inspections", options)
			const { data } = await response.json()

			if (!response.ok) {
				const { error } = await response.json()
				throw new Error(`Failed to start new inspection: ${error}`)
			}
			navigate(`/inspections/${data[0].inspectionId}`)
		} catch (err) {
			console.log(err)
		} finally {
			setIsCreatingNewInspection(false)
		}
	}

	async function deleteRig(rigId: string) {
		setIsDeleting(true)
		setIsConfirmOpen(false)

		try {
			const options = {
				method: "DELETE",
			}
			const response = await fetch(`/api/rigs?id=${rigId}`, options)

			if (!response.ok) {
				const error = await response.json()
				throw new Error(error.error || "Server failed to delete rig.")
			}

			await loadRigs()
		} catch (err) {
			if (err instanceof Error) {
				onDeleteError(err.message)
			}
		}
	}
}
