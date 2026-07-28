import { useState, useEffect } from "react";
import { AppPage } from "@/components/application/AppPage";
import { PageHeader } from "@/components/application/PageHeader";
import { Button } from "@/components/ui/button";
import { CreateRigDialog } from "@/components/rigs/CreateRigDialog";
import { RigCard } from "@/components/rigs/RigCard";
import { SpinnerButton } from "@/components/rigs/SpinnerButton";

import { ErrorMessage } from "@/components/application/ErrorMessage";

import type { Rig } from "@/models/Rig";

export default function RigList() {
    const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
    const [rigs, setRigs] = useState<Rig[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadRigsError, setLoadRigsError] = useState<string | null>(null);
    const [deleteRigError, setDeleteRigError] = useState<string | null>(null);

    useEffect( () => {

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
                    loadRigsError ? <ErrorMessage message={loadRigsError} /> : rigs.map((rig) => {

                    return (<RigCard
                                key={rig.id}
                                rig={rig}
                                onDeleteError={handleDeleteError}
                                onDeleteSuccess={loadRigs}
                            />);
                    })
                }


            </AppPage>

            <CreateRigDialog
                open={isCreateDialogOpen}
                onOpenChange={setCreateDialogOpen}
                loadRigs={loadRigs}
            />
        </>
    );


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
            if (err instanceof Error) setLoadRigsError(err.message)
            else setLoadRigsError("An unepected error occured.")
        } finally {
            setIsLoading(false);
        }
    }

    function handleDeleteError(message: string) {
        setDeleteRigError(message);
    }
}