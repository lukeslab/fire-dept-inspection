import { Link } from "react-router-dom"

import { AppPage } from "@/components/layout/AppPage"
import { PageHeader } from "@/components/application/PageHeader"

import { Input } from "@/components/ui/input"

import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemGroup,
	ItemMedia,
	ItemTitle,
} from "@/components/ui/item"
import { Button } from "@/components/ui/button"
import InspectionListBoard from "@/components/inspections/inspectionListBoard"
import { useEffect, useState } from "react"

export default function InspectionList() {
	const [isLoadingInspections, setIsLoadingInspections] = useState(false)
	const [inspections, setInspections] = useState({
		"In Progress": [],
		Completed: [],
		"Completed with Issues": [],
	})

	useEffect(() => {
		loadInspections()
	}, [])

	return (
		<AppPage>
			<PageHeader
				title="Inspections"
				description="Start, continue, and review rig inspections."
			/>

			<ItemGroup className="flex-row">
				<Item>
					<ItemTitle>Search:</ItemTitle>
					<Input
						name="inspection-search"
						className="w-fit border-gray-300 rounded-sm border-1 pl-2"
						type="search"
						placeholder="Search by inspector or rig name1"
					/>
				</Item>

				<Item>
					<Button>
						<Link to="/rigs">New Inspection</Link>
					</Button>
				</Item>
			</ItemGroup>

			<InspectionListBoard data={inspections} />
		</AppPage>
	)

	async function loadInspections() {
		setIsLoadingInspections(true)

		try {
			const response = await fetch("api/inspections")

			if (!response.ok) {
				throw new Error(`Error fetching inspections: ${response.statusText}`)
			}

			const { data } = await response.json()

			const inspectionsRecords = {
				"In Progress": data.filter(
					(inspection) => inspection.status === "in_progress",
				),
				Completed: data.filter(
					(inspection) =>
						inspection.status === "completed" && inspection.passed,
				),
				"Completed with Issues": data.filter(
					(inspection) =>
						inspection.status === "completed" && !inspection.passed,
				),
			}

			setInspections(inspectionsRecords)
		} catch (error) {
			console.error(error)
		} finally {
			setIsLoadingInspections(false)
		}
	}
}
