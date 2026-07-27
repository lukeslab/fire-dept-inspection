import { useState } from 'react'
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

interface CreateRigDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

interface NewCompartment {
    clientId: string,
    value: string
}


export function CreateRigDialog({
    open,
    onOpenChange,
}: CreateRigDialogProps) {

    const [compartments, setCompartments] = useState<NewCompartment[]>([{clientId: crypto.randomUUID(), value: ""}])

    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent>
                <form>
                    <FieldGroup>
                        <FieldSet>
                            <FieldLegend>
                                Add New Rig
                            </FieldLegend>
                            <FieldDescription>
                                Add a new apparatus and its compartments.
                            </FieldDescription>
                            <FieldGroup>
                                <Field>
                                    <FieldLabel htmlFor="name">Name</FieldLabel>
                                    <Input id="name" placeholder="Engine 240" />
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
                                </Field>
                            )
                        })}
                                    
                                <Field orientation="horizontal">
                                    <Button onClick={handleAddNewCompartment}>New Compartment</Button>
                                </Field>
                            </FieldGroup>
                        </FieldSet>
                        
                        <Field orientation="horizontal">
                            <Button onClick={handleCreateRigDialogSubmit}>Submit</Button>
                        </Field>
                    </FieldGroup>
                </form>
                {/* TODO: Add the rig form here */}
            </DialogContent>
        </Dialog>
    );
    
    
    function handleCreateRigDialogSubmit() {
        return console.log('coming soon.')
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
    
    function handleNewCompartmentInputChange(index: number, value: string) {
        setCompartments(previousCompartments => previousCompartments.map( (compartment, currentIndex) => {
            return currentIndex === index ? {...compartment, value} : compartment
        }))
    }
}

