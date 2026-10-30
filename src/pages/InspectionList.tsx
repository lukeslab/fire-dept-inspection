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

const data = {
	inProgress: [
		{
			id: 1,
			rigName: "Engine 241",
			rigModel: "2021 Seagrave",
			inspector: "Luke Padawer",
			startTime: 1792540800000,
			endTime: 0,
			itemsChecked: 12,
			totalItems: 34,
		},
		{
			id: 2,
			rigName: "Engine 240",
			rigModel: "2021 Seagrave",
			inspector: "John Wick",
			startTime: 1792540700000,
			endTime: 0,
			itemsChecked: 10,
			totalItems: 40,
		},
	],
	completed: [
		{
			id: 3,
			rigName: "Engine 241",
			rigModel: "2021 Seagrave",
			inspector: "Luke Padawer",
			startTime: 1792540600000,
			endTime: 1792540650000,
			itemsChecked: 34,
			totalItems: 34,
			issues: 0,
		},
	],
	issues: [
		{
			id: 4,
			rigName: "Engine 241",
			rigModel: "2021 Seagrave",
			inspector: "Luke Padawer",
			startTime: 1792540040000,
			endTime: 1792540090000,
			itemsChecked: 34,
			totalItems: 34,
			issues: {
				total: 2,
				item_missing: 1,
				item_function: 1,
			},
		},
	],
}

export default function InspectionList() {
	return (
		<AppPage>
			<PageHeader
				title="Inspections"
				description="Start, continue, and review rig inspections."
			/>

			<Item>
				<ItemTitle>Search:</ItemTitle>
				<Input
					name="inspection-search"
					className="w-fit border-gray-300 rounded-sm border-1 pl-2"
					type="search"
					placeholder="Search by inspector or rig name1"
				/>
			</Item>

			<div className="flex flex-row gap-4">
				<ItemGroup className="bg-gray-200 flex-1">
					<ItemTitle>
						In Progress <span>{data["inProgress"].length}</span>
					</ItemTitle>
					{data["inProgress"].map((inspection) => (
						<Item key={inspection.id}>
							<ItemMedia></ItemMedia>
							<ItemTitle>{inspection.rigName}</ItemTitle>
							<ItemDescription>{inspection.rigModel}</ItemDescription>
							<ItemContent>
								<Item>
									<ItemTitle>Inspector</ItemTitle>
									<ItemDescription>{inspection.inspector}</ItemDescription>
								</Item>
							</ItemContent>
						</Item>
					))}
				</ItemGroup>
				<ItemGroup className="bg-gray-200 flex-1">
					<ItemTitle>
						Completed <span>{data["completed"].length}</span>
					</ItemTitle>
				</ItemGroup>
				<ItemGroup className="bg-gray-200 flex-1">
					<ItemTitle>
						Completed with Issues <span>{data["inProgress"].length}</span>
					</ItemTitle>
				</ItemGroup>
			</div>
		</AppPage>
	)
}
