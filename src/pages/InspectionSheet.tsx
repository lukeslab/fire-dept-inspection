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

	useEffect(() => {
		getInspectionById(inspectionId)
	}, [])

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

					<Accordion multiple={true}>
						{inspection.compartments.map((compartment) => (
							<AccordionItem key={compartment.id} value={compartment.id}>
								<AccordionTrigger>{compartment.name}</AccordionTrigger>

								<AccordionContent>
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead>Item name</TableHead>
												<TableHead>Expected quantity</TableHead>
												<TableHead>Actual quantity</TableHead>
												<TableHead>Functional Check</TableHead>
												<TableHead>Comments</TableHead>
											</TableRow>
										</TableHeader>

										<TableBody>
											{compartment.items.map((item) => (
												<TableRow key={item.id}>
													<TableCell>{item.equipmentName}</TableCell>
													<TableCell>{item.expectedQuantity}</TableCell>
													<TableCell>
														<Input type="number" min={0} />
													</TableCell>
													<TableCell>
														{item.requiresFunctionalCheck ? (
															<ToggleGroup>
																<ToggleGroupItem className="data-[pressed]:bg-green-700 data-[pressed]:text-white">
																	<Check />
																</ToggleGroupItem>
																<ToggleGroupItem
																	className="data-[pressed]:bg-red-700 data-[pressed]:text-white"
																	value="n">
																	<X />
																</ToggleGroupItem>
																{/* <Button>Yes</Button>
																<Button>No</Button> */}
															</ToggleGroup>
														) : (
															<p>Not required</p>
														)}
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
					{/* <div className="rounded-xl border border-dashed bg-card px-6 py-16 text-center">
						{inspection.compartments.map((compartment) => {
							return (
								<div className="flex-row">
									<div>
										<h2>{compartment.name}</h2>
									</div>
									<table>
										<thead>
											<tr>
												<th>Name</th>
												<th>Expected Quantity</th>
												<th>Actual Quantity</th>
												<th>Functional Check</th>
											</tr>
										</thead>
										<tbody>
											{compartment.items.map((item) => {
												return (
													<tr>
														<td>{item.equipmentName}</td>
														<td>{item.expectedQuantity}</td>
														<td>
															<input className="border-2 w-20" type="number" />
														</td>
														<td>
															<input
																type="checkbox"
																disabled={item.requiresFunctionalCheck}
															/>
														</td>
													</tr>
												)
											})}
										</tbody>
									</table>
								</div>
							)
						})}
					</div> */}
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

			setInspection(data)
		} catch (error) {
			console.error(error)
		} finally {
			setIsLoadingInspection(false)
		}
	}
}
