import { AppPage } from "@/components/application/AppPage";
import { PageHeader } from "@/components/application/PageHeader";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { CreateRigDialog } from "@/components/rigs/CreateRigDialog";
import { RigCard } from "@/components/rigs/RigCard";

import type { Rig } from "@/models/Rig";
import { SpinnerButton } from "@/components/rigs/SpinnerButton";
import { ErrorMessage } from "@/components/application/ErrorMessage";

export default function RigList() {
    const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
    const [rigs, setRigs] = useState<Rig[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect( () => {
        async function loadRigs() {
            try {
                const response = await fetch("/api/rigs");

                if (!response.ok) {
                    throw new Error(`Error fetching rigs: ${response.statusText}`);
                }

                const data = await response.json();
                setRigs(data);
                console.log(data)
            } catch (err) {
                if (err instanceof Error) setError(err.message)
                else setError("An unepected error occured.")
            } finally {
                setIsLoading(false);
            }
        }

        loadRigs()
    }, [])
    return (
        <>
            <AppPage>
                <PageHeader
                    title="Rigs"
                    description="Manage department apparatus and compartments."
                    actions={
                        <Button onClick={() => setCreateDialogOpen(true)}>
                            Add Rig
                        </Button>
                    }
                />

                {isLoading ? <SpinnerButton /> : 
                    error ? <ErrorMessage message={error} /> : rigs.map((rig) => {
                    return (<RigCard key={rig.id} {...rig} />);
                })}

            </AppPage>

            <CreateRigDialog
                open={isCreateDialogOpen}
                onOpenChange={setCreateDialogOpen}
            />
        </>
    );
}