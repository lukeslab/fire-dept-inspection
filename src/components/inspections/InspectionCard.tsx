import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemGroup,
	ItemMedia,
	ItemSeparator,
	ItemTitle,
} from "@/components/ui/item"
import { Button } from "@/components/ui/button"
import {
	Progress,
	ProgressLabel,
	ProgressValue,
} from "@/components/ui/progress"

import type { InspectionRecord } from "./inspectionListBoard"

export default function InspectionCard({
	inspection,
}: {
	inspection: InspectionRecord
}) {
	return (
		<Item className="bg-white" key={inspection.id}>
			<ItemMedia>?</ItemMedia>
			<div>
				<ItemTitle>{inspection.rigName}</ItemTitle>
				<ItemDescription>{inspection.rigModel}</ItemDescription>
			</div>
			<ItemSeparator />
			<div>
				<Item className="m-0 p-0">
					<ItemTitle>Inspector</ItemTitle>
					<ItemDescription>{inspection.inspector}</ItemDescription>
				</Item>
				<Item className="p-0">
					<ItemTitle>Started</ItemTitle>
					<ItemDescription>{getDate(inspection.startTime)}</ItemDescription>
				</Item>
			</div>
			<ItemSeparator />
			<Progress value={(inspection.itemsChecked / inspection.totalItems) * 100}>
				<ProgressLabel>
					{inspection.itemsChecked} of {inspection.totalItems} items checked
				</ProgressLabel>
				<ProgressValue />
			</Progress>
			<ItemActions>
				<Button>{inspection.endTime ? "View" : "Continue"}</Button>
			</ItemActions>
		</Item>
	)

	function getDate(time: number) {
		const date = new Date(time)

		const formatter = new Intl.DateTimeFormat("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
			hour: "numeric",
			minute: "numeric",
			hour12: false,
		})
		return formatter.format(date)
	}
}
