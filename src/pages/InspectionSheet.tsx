import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router"
import { AppPage } from "@/components/application/AppPage"
import { PageHeader } from "@/components/application/PageHeader"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
	Accordion,
	AccordionItem,
	AccordionContent,
	AccordionTrigger,
} from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { Check, X } from "lucide-react"

export default function InspectionSheet() {
	const { inspectionId } = useParams()
	const navigate = useNavigate()

	// console.log(inspectionId)

	const [isLoadingInspection, setIsLoadingInspection] = useState(true)
	const [inspection, setInspection] = useState()

	const [inspectionResults, setInspectionResults] = useState([])

	useEffect(() => {
		getInspectionById(inspectionId)
	}, [])

	// useEffect(() => {
	// 	checkForIssues()
	// }, [inspectionResults])

	console.log(inspectionResults)

	if (isLoadingInspection) {
		return (
			<AppPage>
				<p>Loading Inspection...</p>
				<Spinner />
			</AppPage>
		)
	}

	if (!inspection) {
		return (
			<AppPage>
				<p>This inspection could not be found.</p>
				<Button onClick={() => navigate("/inspections")}>Go Back</Button>
			</AppPage>
		)
	}

	// Inspection sheet
	return (
		<AppPage>
			{isLoadingInspection ? (
				<Spinner />
			) : (
				<>
					<PageHeader
						title={"Inspection Sheet"}
						description={inspection.rigName}
					/>

					{/* Inspection meta data */}
					<Card>
						<CardContent className="grid gap-6 p-4 md:grid-cols-[240px_1fr] md:p-6">
							<img
								src={inspection.rigImageUrl}
								alt={inspection.rigName}
								className="aspect-video w-full rounded-lg object-cover"
							/>

							<dl className="grid grid-cols-2 gap-x-6 gap-y-4 lg:grid-cols-3">
								<div>
									<dt className="text-sm text-muted-foreground">Rig</dt>
									<dd className="mt-1 text-xl font-semibold">
										{inspection.rigName}
									</dd>
								</div>

								<div>
									<dt className="text-sm text-muted-foreground">Status</dt>
									<dd className="mt-1">
										<Badge variant="secondary">
											{inspection.status === "in_progress"
												? "In progress"
												: "Completed"}
										</Badge>
									</dd>
								</div>

								<div>
									<dt className="text-sm text-muted-foreground">Passed</dt>
									<dd className="mt-1">
										<Badge
											variant={
												inspection.status === "completed" &&
												inspection.passed === false
													? "destructive"
													: "secondary"
											}>
											{inspection.status !== "completed" ||
											inspection.passed == null
												? "Pending"
												: inspection.passed
													? "Passed"
													: "Issues found"}
										</Badge>
									</dd>
								</div>

								<div>
									<dt className="text-sm text-muted-foreground">Inspector</dt>
									<dd className="mt-1 font-medium">{inspection.inspector}</dd>
								</div>

								<div>
									<dt className="text-sm text-muted-foreground">Start time</dt>
									<dd className="mt-1 font-medium">
										{new Date(inspection.startTime).toLocaleString()}
									</dd>
								</div>

								<div>
									<dt className="text-sm text-muted-foreground">End time</dt>
									<dd className="mt-1 font-medium">
										{inspection.endTime
											? new Date(inspection.endTime).toLocaleString()
											: "—"}
									</dd>
								</div>
							</dl>
						</CardContent>
					</Card>

					{/* Inspection worksheet */}
					<Accordion multiple={true}>
						{inspection.compartments.map((compartment) => (
							<AccordionItem key={compartment.id} value={compartment.id}>
								<AccordionTrigger>{compartment.name}</AccordionTrigger>

								<AccordionContent>
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead>Item name</TableHead>
												<TableHead>Expected qty</TableHead>
												<TableHead>Actual qty</TableHead>
												<TableHead>Functional Check</TableHead>
												<TableHead>Issues Found</TableHead>
												<TableHead>Comments</TableHead>
											</TableRow>
										</TableHeader>

										<TableBody>
											{compartment.items.map((item) => (
												<TableRow key={item.id}>
													<TableCell>{item.equipmentName}</TableCell>
													<TableCell>{item.expectedQuantity}</TableCell>
													<TableCell>
														<Input
															type="number"
															min={0}
															onChange={(event) =>
																changeQty(item.id, event.target.value)
															}
														/>
													</TableCell>
													<TableCell>
														{item.requiresFunctionalCheck ? (
															<ToggleGroup
																defaultValue={null}
																onValueChange={(value) =>
																	changeIsFunctional(
																		item.id,
																		Boolean(Number(value)),
																	)
																}>
																<ToggleGroupItem
																	className="data-pressed:bg-green-700 data-pressed:text-white"
																	value="1">
																	<Check />
																</ToggleGroupItem>
																<ToggleGroupItem
																	className="data-pressed:bg-red-700 data-pressed:text-white"
																	value="0">
																	<X />
																</ToggleGroupItem>
															</ToggleGroup>
														) : (
															<p>Not required</p>
														)}
													</TableCell>
													<TableCell>
														<ul>
															{inspectionResults
																.filter(
																	(result) => item.id === result.itemId,
																)[0]
																.issuesFound.map((issue) => (
																	<li>{issue}</li>
																))}
														</ul>
													</TableCell>
													<TableCell>
														<Input className="border-2" type="text" />
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				</>
			)}
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

			setInspectionResults(
				data.compartments.flatMap((compartment) =>
					compartment.items.map((item) => ({
						inspectionId: data.id,
						itemId: item.id,
						expectedQuantity: item.expectedQuantity,
						actualQuantity: null,
						isFunctional: null,
						issuesFound: [],
						comments: null,
					})),
				),
			)

			setInspection(data)
		} catch (error) {
			console.error(error)
		} finally {
			setIsLoadingInspection(false)
		}
	}

	async function changeQty(itemId, value) {
		setInspectionResults((prev) =>
			prev.map((item) =>
				item.itemId === itemId
					? { ...item, actualQuantity: Number(value) }
					: item,
			),
		)
		checkForIssues(itemId)
	}

	async function changeIsFunctional(
		itemId: string,
		isFunctional: boolean | null,
	) {
		setInspectionResults((prev) =>
			prev.map((item) => {
				if (item.itemId !== itemId) return item

				const updatedItem = { ...item, isFunctional }
				console.log(updatedItem)
				return {
					...updatedItem,
					issuesFound: getIssues(updatedItem),
				}
			}),
		)
	}

	function getIssues(item) {
		const issues: string[] = []

		if (item.actualQuantity !== null) {
			if (item.actualQuantity < item.expectedQuantity) {
				issues.push(
					`Missing item(s): ${item.expectedQuantity - item.actualQuantity}`,
				)
			} else if (item.actualQuantity > item.expectedQuantity) {
				issues.push(
					`Extra item(s): ${item.actualQuantity - item.expectedQuantity}`,
				)
			}
		}

		if (item.isFunctional === false) {
			issues.push("Item not functional")
		}
		console.log(typeof item.isFunctional)
		return issues
	}
}
