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
import { PlusIcon, Trash2 } from 'lucide-react';

import { type CompartmentsState } from "./RigDialog";

interface RigDialogCompartmentsTabProps {
    mode: string,
    name: string,
    compartments: CompartmentState,
    handleNameInputChange: () => void,
    handleNewCompartmentInputChange: () => void,
    handleRemoveCompartment: () => void,
    handleAddNewCompartment: () => void
}

export function RigDialogCompartmentsTab({
    mode,
    name,
    compartments,
    handleNameInputChange,
    handleNewCompartmentInputChange,
    handleRemoveCompartment,
    handleAddNewCompartment
}: RigDialogCompartmentsTabProps) {

    return (   
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

                        {compartments[group.key].map( (compartment) => {
                            return (
                                <Field key={compartment.reactKey} orientation="horizontal">
                                    <FieldLabel htmlFor={compartment.reactKey}>{compartment.position} </FieldLabel>
                                    <Input 
                                        id={compartment.reactKey} 
                                        placeholder={group.placeholder} 
                                        value={compartment?.name} 
                                        onChange={event => handleNewCompartmentInputChange(compartment.reactKey, group.key, event.target.value)}    
                                    />
                                    <Button type="button" size="icon" variant="destructive" onClick={() => handleRemoveCompartment(compartment.reactKey, group.key)}>
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
    )
}  