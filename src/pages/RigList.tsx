import { useState, useEffect } from "react";
import { AppPage } from "@/components/application/AppPage";
import { PageHeader } from "@/components/application/PageHeader";
import { Button } from "@/components/ui/button";
import { RigDialog } from "@/components/rigs/RigDialog";
import { RigCard } from "@/components/rigs/RigCard";
import { SpinnerButton } from "@/components/rigs/SpinnerButton";

import { ErrorMessage } from "@/components/application/ErrorMessage";

import type { Rig } from "@/models/Rig";

export default function RigList() {

    // const { rigs, isLoading, error: loadRigsError, loadRigs } = useRigs();

    const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
    const [deleteRigError, setDeleteRigError] = useState<string | null>(null);

    const [rigs, setRigs] = useState<Rig[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [loadError, setLoadError] = useState<string | null>(null)

    useEffect(() => {
        loadRigs()
    }, [])

    
    return (
        <>
            <AppPage>
                {deleteRigError && <ErrorMessage message={deleteRigError} />}
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
                    loadError ? <ErrorMessage message={loadError} /> : rigs.map((rig) => {

                    return (<RigCard
                                key={rig.id}
                                rig={rig}
                                onDeleteError={handleDeleteError}
                                loadRigs={loadRigs}
                            />);
                    })
                }


            </AppPage>

            <RigDialog
                mode='create'
                open={isCreateDialogOpen}
                onOpenChange={setCreateDialogOpen}
                loadRigs={loadRigs}
            />
        </>
    );


    async function loadRigs() {
        try {
        setIsLoading(true)
        setLoadError(null)

        const response = await fetch("/api/rigs")

        if (!response.ok) {
            throw new Error(`Error fetching rigs: ${response.statusText}`)
        }

        const data = await response.json()
        setRigs(data)
        } catch (err) {
        setLoadError(
            err instanceof Error ? err.message : "An unexpected error occurred."
        )
        } finally {
        setIsLoading(false)
        }
    }

    function handleDeleteError(message: string) {
        setDeleteRigError(message);
    }
}