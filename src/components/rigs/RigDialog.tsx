import { useState, useEffect } from 'react'

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

import { RigDialogCompartmentsTab } from './RigDialogCompartmentsTab';
import { RigDialogInfoTab } from './RigDialogInfoTab';

import { COMPARTMENT_GROUPS } from '@/lib/db/compartmentGroups';

import type { Compartment } from "@/models/Compartment"
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

    const initialCompartments = COMPARTMENT_GROUPS.reduce( (acc, group) => {
        acc[group.key] = [
            {
                reactKey: crypto.randomUUID(), 
                name: "", 
                position: 1
            }
        ]
        return acc
    }, {} as CompartmentsState)
    
    const [dialogTab, setDialogTab] = useState<DialogTab>('info')
    const [dialogMode, setDialogMode] = useState<"create" | "view" | "edit">(mode)

    const [name, setName] = useState<string>("")
    const [compartments, setCompartments] = useState<CompartmentsState>(initialCompartments)
    
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
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >     
            <DialogContent className="sm:max-w-4xl overflow-y-auto max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle>
                        {dialogMode === 'create' ? 'Add New Rig' : dialogMode === 'edit' ? `Edit Rig: ${name}` : `View Rig: ${name}`}
                    </DialogTitle>
                </DialogHeader>
              
                <Tabs defaultValue="info" onValueChange={(value) => setDialogTab(value)}>
                    <TabsList variant="line">
                        <TabsTrigger value="info">Info</TabsTrigger>
                        <TabsTrigger value="compartments">Compartments</TabsTrigger>
                        <TabsTrigger value="equipment">Equipment</TabsTrigger>
                    </TabsList>
                </Tabs>

                <form onSubmit={handleRigDialogSubmit}>
                    <div className=" items-center mt-6">

                        {dialogTab === 'info' ? <RigDialogInfoTab mode={dialogMode} name={name} /> : 'test'}

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
                            <p className="text-success text-sm">Rig {mode === 'edit' ? 'updated' : 'created'} successfully!</p>
                        )}

                        {isSubmitting ? (
                            <Button type="submit" disabled>
                                Submitting...
                            </Button>
                        ) : (
                            <Button type="submit">Submit</Button>
                        )}
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
    
    async function loadRig(rigId: string) {

        const response = await fetch(`/api/rigs?id=${rigId}`)

        if (!response.ok) {
            setRequestErrors("Failed to get rig from server.")
        } 

        const [data] = await response.json()

        const retrievedCompartments = data.compartments.reduce(
            (acc: CompartmentsState, compartment: Compartment) => {
                if (!acc[compartment.group_key]) {
                    acc[compartment.group_key] = []
                }
                acc[compartment.group_key].push({
                    id: compartment.id,
                    reactKey: crypto.randomUUID(),
                    name: compartment.name,
                    position: compartment.position
                })
                return acc
            }, 
            {} as CompartmentsState
        )

        setValidationErrors([])
        setName(data.rig_name)
        setCompartments(retrievedCompartments)
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

    function handleRemoveCompartment(reactKey: string, groupKey: CompartmentGroupKey) {
        if (compartments[groupKey].length == 1) {
            setValidationErrors(['You must have atleast one compartment'])
            return
        }

        setCompartments( previousCompartments => ({
            ...previousCompartments,
            [groupKey]: previousCompartments[groupKey]
            .filter((compartment) => compartment.reactKey !== reactKey)
            .map((compartment, index) => ({
                ...compartment,
                position: index + 1
            }))
        }))
    }

    function handleAddNewCompartment(groupKey: CompartmentGroupKey) {

        const lastPosition = compartments[groupKey].length

        setCompartments(previousCompartments => ({
            ...previousCompartments,
            [groupKey]: [
                ...previousCompartments[groupKey], 
                {
                    reactKey: crypto.randomUUID(),
                    name: '',
                    position: lastPosition + 1
                }
            ]
        }))
    }

    function handleNameInputChange(value: string) {
        setName(value);
    }

    function handleNewCompartmentInputChange(reactKey: string, groupKey: CompartmentGroupKey, name: string) {
        setCompartments(previousCompartments => ({
            ...previousCompartments,
            [groupKey]: previousCompartments[groupKey].map((compartment) => {
                return compartment.reactKey === reactKey ? {...compartment, name} : compartment
            })
        }))
    }
}

