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
}
