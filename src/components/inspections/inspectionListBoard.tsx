import { ItemGroup, ItemTitle } from "@/components/ui/item"
import InspectionCard from "./InspectionCard"

export type InspectionRecord = {
	id: number
	rigName: string
	rigModel: string
	inspector: string
	startTime: number
	endTime: 0 | number
	itemsChecked: number
	totalItems: number
}

interface InspectionListBoardProps {
	data: {
		"In Progress": InspectionRecord[]
		Completed: InspectionRecord[]
		"Completed with Issues": InspectionRecord[]
	}
}

export default function InspectionListBoard({
	data,
}: InspectionListBoardProps) {
	const boards = Object.keys(data) as (keyof typeof data)[]

	return (
		<div className="flex flex-row gap-4">
			{boards.map((board) => (
				<ItemGroup className="bg-gray-200 flex-1 p-5">
					<ItemTitle>
						{/* <p>{board}</p> */}
						{board} <span>{data[board].length}</span>
					</ItemTitle>
					{data[board].map((inspection) => (
						<InspectionCard inspection={inspection} />
					))}
				</ItemGroup>
			))}
			{/* <ItemGroup className="bg-gray-200 flex-1">
				<ItemTitle>
					Completed <span>{data["completed"].length}</span>
				</ItemTitle>
			</ItemGroup>
			<ItemGroup className="bg-gray-200 flex-1">
				<ItemTitle>
					Completed with Issues <span>{data["inProgress"].length}</span>
				</ItemTitle>
			</ItemGroup> */}
		</div>
	)
}
