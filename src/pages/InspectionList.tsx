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

const data = {
	"In Progress": [
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
	Completed: [
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
	"Completed with Issues": [
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

			<InspectionListBoard data={data} />
		</AppPage>
	)
}
