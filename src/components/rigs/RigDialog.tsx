import { useState, useEffect } from 'react'

import { Spinner } from '@/components/ui/spinner';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    // DialogDescription,
    // DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button"

import { COMPARTMENT_GROUPS } from '@/lib/db/compartmentGroups';

import type { Rig } from "@/models/Rig"

import { RigDialogCompartmentsTab } from './RigDialogCompartmentsTab';
import { RigDialogInfoTab } from './RigDialogInfoTab';

interface RigDialogProps {
    mode: "create" | "view",
    rigId?: string,
    open: boolean;
    onOpenChange: (open: boolean) => void;
    loadRigs: () => void;
}

interface ReactFormCompartment {
    id?: string,
    reactKey: string,
    name: string,
    position: number
}

type DialogTab = "info" | "compartments" | "equipment"
type CompartmentGroupKey = (typeof COMPARTMENT_GROUPS)[number]['key']
export type CompartmentsState = Record<CompartmentGroupKey, ReactFormCompartment[]>

export function RigDialog({
    mode,
    open,
    rigId,
    onOpenChange,
    loadRigs
}: RigDialogProps) {

    // const initialCompartments = COMPARTMENT_GROUPS.reduce( (acc, group) => {
    //     acc[group.key] = [
    //         {
    //             reactKey: crypto.randomUUID(), 
    //             name: "", 
    //             position: 1
    //         }
    //     ]
    //     return acc
    // }, {} as CompartmentsState)
    
    const [dialogTab, setDialogTab] = useState<DialogTab>('info')
    const [dialogMode, setDialogMode] = useState<"create" | "view" | "edit">(mode)

    const [rigIsLoading, setRigIsLoading] = useState(true);
    const [rig, setRig] = useState<Rig>()
    // const [name, setName] = useState<string>("")
    
    // const [deleteDialogIsOpen, setDeleteDialogIsOpen] = useState(false)
    // const [isDeleting, setIsDeleting] = useState(false)

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const [validationErrors, setValidationErrors] = useState<string[]>([])
    const [requestErrors, setRequestErrors] = useState<string | null>(null)
    const [isSuccess, setIsSuccess] = useState<boolean>(false)

    useEffect( () => {
        if (dialogMode === 'view' && open && rigId) {
            loadRig(rigId)
        }
    },[dialogMode, open, rigId] )


    // Clean up success / fail messaging on dialog close.
    useEffect( () => {
        ( async () => {
            setValidationErrors([])
            setIsSuccess(false)
        })()
    }, [open])

    // console.log(compartments)
    return (
        <>
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >   
            <DialogContent className="sm:max-w-4xl overflow-y-auto max-h-[90vh]">  
                {rigIsLoading ? <Spinner /> :
                    <>
                        <DialogHeader>
                            <DialogTitle>
                                {dialogMode === 'create' ? 'Add New Rig' : dialogMode === 'edit' ? `Edit Rig: ${rig.name}` : `View Rig: ${rig.name}`}
                            </DialogTitle>
                        </DialogHeader>
                    
                        <Tabs defaultValue="info" onValueChange={(value) => setDialogTab(value)}>
                            <TabsList variant="line">
                                <TabsTrigger value="info">Info</TabsTrigger>
                                <TabsTrigger value="compartments">Compartments</TabsTrigger>
                                <TabsTrigger value="equipment">Equipment</TabsTrigger>
                            </TabsList>
                        </Tabs>

                        <form id="RigDialogForm" onSubmit={handleRigDialogSubmit}>
                            <div className=" items-center mt-6">

                                {dialogTab === 'info' && <RigDialogInfoTab mode={dialogMode} rig={rig} /> } 

                                {dialogTab === 'compartments' && <RigDialogCompartmentsTab mode={dialogMode} rig={rig} />}

                                {/* {dialogTab === 'equipment' && <RigDialogEquipmentTab />} */}

                                {validationErrors.length > 0 && (
                                    <ul className="text-destructive text-sm">
                                        {validationErrors.map((error, index) => (
                                            <li key={index}>{error}</li>
                                        ))}
                                    </ul>
                                )}
                                {requestErrors && (
                                    <p className="text-destructive text-sm">{requestErrors}</p>
                                )}
                                {isSuccess && (
                                    <p className="text-success text-sm">Rig {dialogMode === 'edit' ? 'updated' : 'created'} successfully!</p>
                                )}

                            </div>
                        </form>
                        <div>
                            {isSubmitting ? (
                                <Button type="submit" disabled>
                                    Submitting...
                                </Button>
                            ) : (
                                dialogMode === 'edit' && <Button type="submit" form="RigDialogForm">Submit</Button>
                            )}
                            {dialogMode === 'edit' && <Button variant="secondary" onClick={() => setDialogMode('view')}>Cancel</Button>}
                            {dialogMode === 'view' && (
                                <> 
                                    <Button onClick={() => setDialogMode('edit')}>Edit</Button>
                                    <Button variant="destructive">Delete</Button>
                                </>
                            )}
                        </div>
                    </>
                }
            </DialogContent>
        </Dialog>
        </>
    );
    
    async function loadRig(rigId: string) {

        const response = await fetch(`/api/rigs?id=${rigId}`)

        if (!response.ok) {
            setRequestErrors("Failed to get rig from server.")
        } 

        const [ data ] = await response.json()

        // const retrievedCompartments = data.compartments.reduce(
        //     (acc: CompartmentsState, compartment: Compartment) => {
        //         if (!acc[compartment.group_key]) {
        //             acc[compartment.group_key] = []
        //         }
        //         acc[compartment.group_key].push({
        //             id: compartment.id,
        //             reactKey: crypto.randomUUID(),
        //             name: compartment.name,
        //             position: compartment.position
        //         })
        //         return acc
        //     }, 
        //     {} as CompartmentsState
        // )

        setValidationErrors([])
        setRig({...data})
        // setName(data.rig_name)
        // setCompartments(comp)
        setRigIsLoading(false)
    }

    async function handleRigDialogSubmit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();

        setValidationErrors([]);
        setRequestErrors(null); 
        setIsSubmitting(true);
        setIsSuccess(false);

        const flatCompartments = Object.entries(compartments).flatMap( ([groupKey, groupCompartments]) => 
            groupCompartments.map(compartment => (
                {
                    ...compartment,
                    group_key: groupKey
                }
            )
        ))

        const payload = {
            name: name.trim(),
            compartments: flatCompartments
        }

        if (!payload.name) {
            setValidationErrors(prev => [...prev, "Please enter a rig name."]);
            setIsSubmitting(false)
            return
        }

        if (payload.compartments.length === 0) {
            setValidationErrors(prev => [...prev, "Please enter at least one compartment."]);
            setIsSubmitting(false)
            return
        }

        // This request will depend on the mode.
        try {
            let response;
            switch(mode){
                case 'create':
                    response = await fetch('/api/rigs', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(payload)
                    });
                    break;
                case 'edit':
                    response = await fetch('/api/rigs', {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            id: rigId,
                            ...payload
                        })
                    });
                    break;
            }

            if (!response.ok) {
                const errorData = await response.json();
                console.log(errorData)
                setRequestErrors(errorData.error || "Request rejected from server.");
            } else {
                setIsSuccess(true);
                setName("");
                setCompartments(initialCompartments);
                loadRigs()
            }

        } catch(error) {
            console.error('Request failed to send: ', error)
            setRequestErrors("Request failed to send.");
        } finally {
            setIsSubmitting(false);
        }

        return console.log('coming soon.')
    }
}

