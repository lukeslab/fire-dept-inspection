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
//   FieldSeparator,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"
import { PlusIcon, Trash2 } from 'lucide-react';

interface RigDialogProps {
    mode: "edit" | "create",
    rigId?: string,
    open: boolean;
    onOpenChange: (open: boolean) => void;
    loadRigs: () => void;
}

interface FormCompartment {
    id?: string,
    clientId: string,
    value: string
}

export function RigDialog({
    mode,
    open,
    rigId,
    onOpenChange,
    loadRigs
}: RigDialogProps) {
    
    const [compartments, setCompartments] = useState<FormCompartment[]>([{clientId: crypto.randomUUID(), value: ""}])
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
                    <FieldGroup>
                        <FieldSet>
                            <FieldLegend>
                                {mode === 'create' ? 'Create New' : 'Edit'} Rig
                            </FieldLegend>
                            <FieldDescription>
                                {mode === 'create' ? 'Enter new' : 'Change'} apparatus name and its compartments.
                            </FieldDescription>
                            <FieldGroup>
                                <Field>
                                    <FieldLabel htmlFor="name">Name</FieldLabel>
                                    <Input 
                                        id="name" 
                                        placeholder="Engine 240" 
                                        value={name}
                                        onChange={event => handleNameInputChange(event.target.value)}
                                    />
                                </Field>
                            </FieldGroup>
                        </FieldSet>
                        <FieldSet>
                            <FieldLegend>Add Compartments</FieldLegend>
                            <FieldDescription> 
                                Enter compartment name into the box. Click new compartment to add more. 
                            </FieldDescription>
                            <FieldGroup>

                        {compartments.map( (compartment, index) => {
                            return (
                                <Field key={compartment.clientId} orientation="horizontal">
                                    <FieldLabel htmlFor={`c-${index}`}>{index+1} </FieldLabel>
                                    <Input 
                                        id={`c-${index}`} 
                                        placeholder="e.x. Driver Side Cab, Front Bumper, Offer Side Cab" 
                                        value={compartment?.value} 
                                        onChange={event => handleNewCompartmentInputChange(index, event.target.value)}    
                                    />
                                    <Button type="button" size="icon" variant="destructive" onClick={() => handleRemoveCompartment(index)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </Field>
                            )
                        })}

                                <Field orientation="horizontal">
                                    <Button type="button" variant="outline" onClick={handleAddNewCompartment}>
                                        <PlusIcon 
                                            className="h-4 w-4" /> Add Compartment
                                    </Button>
                                </Field>
                            </FieldGroup>
                        </FieldSet>
                    </FieldGroup>
                        
                
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
                clientId: crypto.randomUUID(),
                value: compartment.name
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
            name: compartment.value.trim()
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
                setCompartments([{clientId: crypto.randomUUID(), value: ""}]);
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

    function handleRemoveCompartment(index: number) {
        if (compartments.length == 1) {
            setValidationErrors(['You must have atleast one compartment'])
            return
        }
        setCompartments(previousCompartments => previousCompartments.filter((_, currentIndex) => currentIndex !== index))
    }

    function handleAddNewCompartment() {
        setCompartments(previousCompartments => [
            ...previousCompartments,
            {
                clientId: crypto.randomUUID(),
                value: ''
            }
        ])
    }

    function handleNameInputChange(value: string) {
        setName(value);
    }

    function handleNewCompartmentInputChange(index: number, value: string) {
        setCompartments(previousCompartments => previousCompartments.map( (compartment, currentIndex) => {
            return currentIndex === index ? {...compartment, value} : compartment
        }))
    }
}

