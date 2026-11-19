import { useEffect, useState } from "react"
import { useParams } from "react-router"
import { AppPage } from "@/components/application/AppPage"
import { PageHeader } from "@/components/application/PageHeader"

interface InspectionSheetProps {
	title: string
	description: string
}

export default function InspectionSheet({
	title,
	description,
}: InspectionSheetProps) {
	const { inspectionId } = useParams()

	// console.log(inspectionId)

	const [isLoadingInspection, setIsLoadingInspection] = useState(false)
	const [inspection, setInspection] = useState(false)

	useEffect(() => {
		getInspectionById(inspectionId)
	}, [])

	return (
		<AppPage>
			<PageHeader title={title} description={description} />

			<div className="rounded-xl border border-dashed bg-card px-6 py-16 text-center">
				<p className="text-sm text-muted-foreground">
					This screen has not been built yet.
				</p>
			</div>
		</AppPage>
	)

	async function getInspectionById(id) {
		setIsLoadingInspection(true)

		try {
			const response = await fetch(
				`/api/inspections?id=${encodeURIComponent(id)}`,
			)

			if (!response.ok) {
				throw new Error(`Error fetching inspection: ${response.statusText}`)
			}

			const { data } = await response.json()

			console.log(data)

			setInspection(data)
		} catch (error) {
			console.error(error)
		} finally {
			setIsLoadingInspection(false)
		}
	}
}
