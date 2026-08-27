import { useState } from 'react'
import { PlusIcon, Trash2 } from 'lucide-react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Field,
//   FieldDescription,
  FieldGroup,
  FieldLabel,
//   FieldSeparator,
//   FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { COMPARTMENT_GROUPS } from '@/lib/db/compartmentGroups';

import { type Compartment } from '@/models/Compartment';
import { type Rig } from '@/models/Rig'

interface CompartmentFormInput {
    id?: string,
    reactKey: string,
    name: string,
    position: number
}

type CompartmentGroupKey = (typeof COMPARTMENT_GROUPS)[number]['key']
export type CompartmentsState = Record<CompartmentGroupKey, CompartmentFormInput[]>

interface RigDialogCompartmentsTabProps {
    mode: string,
    rig?: Rig,
}

export function RigDialogCompartmentsTab({
    mode,
    rig
}: RigDialogCompartmentsTabProps) {

    const [compartments, setCompartments] = useState<CompartmentsState>(() => {
        if (mode === 'view' && rig) {
         return rig.compartments.reduce(
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
        }
        
        if (mode === 'create') {
            return COMPARTMENT_GROUPS.reduce( (acc, group) => {
                    acc[group.key] = [
                        {
                            reactKey: crypto.randomUUID(), 
                            name: "", 
                            position: 1
                        }
                    ]
                    return acc
                }, {} as CompartmentsState)
        }

        return {} as CompartmentsState
    })

    console.log('compartments are: ', compartments)

    return (   
        <Accordion
             className="max-w-lg" 
        >
            <FieldSet>        
                {COMPARTMENT_GROUPS.map( (group) => {
                    return (
                        <> 
                            <AccordionItem value={group.key}>
                                <AccordionTrigger>{group.label}</AccordionTrigger>
                                <AccordionContent>
                                    <FieldGroup>

                                {compartments[group.key] && compartments[group.key].map( (compartment) => {
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
                                </AccordionContent>
                            </AccordionItem>
                        </>
                    )
                })}       
            </FieldSet>
        </Accordion>
    )

    function handleNewCompartmentInputChange(reactKey: string, groupKey: CompartmentGroupKey, name: string) {
        setCompartments(previousCompartments => ({
            ...previousCompartments,
            [groupKey]: previousCompartments[groupKey].map((compartment) => {
                return compartment.reactKey === reactKey ? {...compartment, name} : compartment
            })
        }))
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
}  