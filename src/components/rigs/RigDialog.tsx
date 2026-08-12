import { useState, useEffect } from 'react'
import {
    Dialog,
    DialogContent,
    // DialogDescription,
    // DialogHeader,
    // DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"
import { PlusIcon, Trash2 } from 'lucide-react';

import { COMPARTMENT_GROUPS } from '@/lib/db/compartmentGroups';
import { Separator } from '../ui/separator';

interface RigDialogProps {
    mode: "edit" | "create",
    rigId?: string,
    open: boolean;
    onOpenChange: (open: boolean) => void;
    loadRigs: () => void;
}

interface ReactFormCompartment {
    group_key: string,
    id?: string,
    reactKey: string,
    name: string
}

export function RigDialog({
    mode,
    open,
    rigId,
    onOpenChange,
    loadRigs
}: RigDialogProps) {
    
    const [compartments, setCompartments] = useState<ReactFormCompartment[]>(
        () => COMPARTMENT_GROUPS.map( group => ({
                reactKey: crypto.randomUUID(),
                group_key: group.key,
                name: "",
                position: 0
        }))
    )
    const [name, setName] = useState<string>("")
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const [validationErrors, setValidationErrors] = useState<string[]>([])
    const [requestErrors, setRequestErrors] = useState<string | null>(null)
    const [isSuccess, setIsSuccess] = useState<boolean>(false)

    useEffect( () => {
        if (mode === 'edit' && open && rigId) {
            loadRig(rigId)
        }
    },[mode, open, rigId] )

    console.log(compartments)
    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent className="overflow-y-auto max-h-[90vh]">
                <form onSubmit={handleRigDialogSubmit}>
                    <FieldSet>
                        <FieldLegend>
                            {mode === 'create' ? 'Create New' : 'Edit'} Rig
                        </FieldLegend>
                        <FieldDescription>
                            {mode === 'create' ? 'Enter new' : 'Change'} apparatus name and its compartments.
                        </FieldDescription>
                        
                        <FieldGroup>
                            <Field orientation="horizontal">
                                <FieldLabel htmlFor="name">Name</FieldLabel>
                                <Input 
                                    id="name" 
                                    placeholder="Engine 240" 
                                    value={name}
                                    onChange={event => handleNameInputChange(event.target.value)}
                                />
                            </Field>
                        </FieldGroup>
               
                        <FieldSeparator />
                        <FieldSet>
                            <FieldLegend>Compartments</FieldLegend>
                            <FieldDescription>Compartments are broken into various groups. Each group must have atleast one compartment.</FieldDescription>
                            
                        {COMPARTMENT_GROUPS.map( (group) => {
                            return (
                                <> 
                                    <FieldGroup>
                                        <FieldLegend >{`- ${group.label}`}</FieldLegend>

                                    {compartments.filter(compartment => compartment.group_key === group.key).map( (compartment, index,) => {
                                        return (
                                            <Field key={compartment.reactKey} orientation="horizontal">
                                                <FieldLabel htmlFor={`c-${index}`}>{index+1} </FieldLabel>
                                                <Input 
                                                    id={`c-${index}`} 
                                                    placeholder="e.x. Driver Side Cab, Front Bumper, Offer Side Cab" 
                                                    value={compartment?.name} 
                                                    onChange={event => handleNewCompartmentInputChange(compartment.reactKey, event.target.value)}    
                                                />
                                                <Button type="button" size="icon" variant="destructive" onClick={() => handleRemoveCompartment(compartment.reactKey)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </Field>
                                        )
                                    })}
                                    </FieldGroup>
                                    <FieldGroup>
                                        <Field orientation="horizontal">
                                            <Button type="button" variant="outline" onClick={() => handleAddNewCompartment(group.key)}>
                                                <PlusIcon 
                                                    className="h-4 w-4" /> Add Compartment
                                            </Button>
                                        </Field>
                                    </FieldGroup>
                                </>

                            )
                        })}

                       
                        </FieldSet>
                    </FieldSet>
                        
                
                    <div className="flex justify-between items-center mt-6">
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
        setValidationErrors([])
        setName(data.rig_name)
        setCompartments(
            data.compartments.map((compartment: {id: string; name: string}) => ({
                id: compartment.id,
                reactKey: crypto.randomUUID(),
                name: compartment.name
            }))
        )
    }

    async function handleRigDialogSubmit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();

        setValidationErrors([]);
        setRequestErrors(null); 
        setIsSubmitting(true);
        setIsSuccess(false);

        const validCompartments = compartments.map(compartment => ({
            id: compartment.id,
            name: compartment.name.trim()
        })).filter(compartment => compartment.name !== '');

        const payload = {
            name: name.trim(),
            compartments: validCompartments
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
                setCompartments([{reactKey: crypto.randomUUID(), value: ""}]);
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

    function handleRemoveCompartment(reactKey: string) {
        if (compartments.length == 1) {
            setValidationErrors(['You must have atleast one compartment'])
            return
        }
        setCompartments(previousCompartments => previousCompartments.filter((compartment) => compartment.reactKey !== reactKey))
    }

    function handleAddNewCompartment(groupKey: string) {
        setCompartments(previousCompartments => [
            ...previousCompartments,
            {
                group_key: groupKey,
                reactKey: crypto.randomUUID(),
                name: ''
            }
        ])
    }

    function handleNameInputChange(value: string) {
        setName(value);
    }

    function handleNewCompartmentInputChange(reactKey: string, name: string) {
        setCompartments(previousCompartments => previousCompartments.map( (compartment) => {
            console.log('comp', compartment, reactKey)
            return compartment.reactKey === reactKey ? {...compartment, name} : compartment
        }))
    }
}

