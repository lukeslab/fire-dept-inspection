import { useState } from 'react'
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

import { type Rig } from '@/models/Rig';

import { EmptyOutline } from "@/components/application/EmptyOutline";



interface RigDialogInfoTabProps {
    mode: string,
    rig: Rig,
}

export function RigDialogInfoTab({
    mode,
    rig,
}: RigDialogInfoTabProps) {

    console.log(rig)

    const [name, setName] = useState(rig.name)
    const [year, setYear] = useState(rig.year)
    const [make, setMake] = useState(rig.make)

    console.log(name)

    return (   
        <FieldSet>
            <FieldLegend>
                Rig Information
            </FieldLegend>
            <FieldDescription>
                {mode === 'create' ? 'Add ' : mode === 'edit' ? `Edit ` : `View `} apparatus name, year, make, model, and specs.
            </FieldDescription>
            
            <FieldGroup className="grid grid-cols-2 gap-4">
               {mode === 'create' ? <EmptyOutline></EmptyOutline> : <img src={`${rig.image_url}`}/>}
                <FieldGroup>
                    <FieldGroup>
                        <Field orientation="horizontal">
                            <FieldLabel htmlFor="name">Name</FieldLabel>
                            {mode === 'view' ? <p className="min-h-9 py-2 text-sm">{name}</p> : <Input 
                                id="name" 
                                placeholder="Engine 240" 
                                value={name}
                                onChange={event => setName(event.target.value)}
                                readOnly={mode === 'view'}
                            />}
                        </Field>
                    </FieldGroup>
                    <FieldGroup className="grid grid-cols-2 gap-4">
                        <Field orientation="horizontal">
                            <FieldLabel htmlFor="year">Year</FieldLabel>
                            {mode === 'view' ? <p className="min-h-9 py-2 text-sm">{year}</p> : <Input 
                                id="year" 
                                placeholder="Enter year" 
                                value={year}
                                onChange={event => setYear(event.target.value)}
                                readOnly={mode === 'view'}
                            />}
                        </Field>
                        <Field orientation="horizontal">
                            <FieldLabel htmlFor="make">Make</FieldLabel>
                            {mode === 'view' ? <p className="min-h-9 py-2 text-sm">{make}</p> : <Input 
                                id="name" 
                                placeholder="Enter make" 
                                value={make}
                                onChange={event => setMake(event.target.value)}
                                readOnly={mode === 'view'}
                            />}
                        </Field>
                    </FieldGroup>
                </FieldGroup>
            </FieldGroup>
        </FieldSet>
    )
}  