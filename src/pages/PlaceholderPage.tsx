import { AppPage } from "@/components/application/AppPage";
import { PageHeader } from "@/components/application/PageHeader";

interface PlaceholderPageProps {
  title: string;
  description: string;
}

export function PlaceholderPage({
  title,
  description,
}: PlaceholderPageProps) {
  return (
    <AppPage>
      <PageHeader
        title={title}
        description={description}
      />

      <div className="rounded-xl border border-dashed bg-card px-6 py-16 text-center">
        <p className="text-sm text-muted-foreground">
          This screen has not been built yet.
        </p>
      </div>
    </AppPage>
  );
}