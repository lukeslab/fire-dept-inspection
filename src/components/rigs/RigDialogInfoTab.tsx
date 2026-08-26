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
import { PlusIcon, Trash2 } from 'lucide-react';
import { EmptyState } from "../application/EmpyState";
import { EmptyOutline } from "../application/EmptyOutline";


interface RigDialogInfoTabProps {
    mode: string,
    rig: {name: string, compartments: [], image_url: string},
}

export function RigDialogInfoTab({
    mode,
    rig,
}: RigDialogInfoTabProps) {

    const name = rig.name

    return (   
        <FieldSet>
            <FieldLegend>
                Rig Information
            </FieldLegend>
            <FieldDescription>
                {mode === 'create' ? 'Add ' : mode === 'edit' ? `Edit ` : `View `} apparatus name, year, make, model, and specs.
            </FieldDescription>
            
            <FieldGroup className="grid grid-cols-2 gap-4">
                {/* <EmptyState icon={<div>hello</div>} title="test" description="test" action={<button>sup</button>}/> */}
               {mode === 'create' ? <EmptyOutline></EmptyOutline> : <img src={`${rig.image_url}`}/>}
                <FieldGroup>
                    <FieldGroup>
                        <Field orientation="horizontal">
                            <FieldLabel htmlFor="name">Name</FieldLabel>
                            <Input 
                                id="name" 
                                placeholder="Engine 240" 
                                value={name}
                                onChange={event => handleNameInputChange(event.target.value)}
                                readOnly={mode === 'view'}
                            />
                        </Field>
                    </FieldGroup>
                    <FieldGroup className="grid grid-cols-2 gap-4">
                        <Field orientation="horizontal">
                            <FieldLabel htmlFor="year">Year</FieldLabel>
                            <Input 
                                id="year" 
                                placeholder="Engine 240" 
                                value={name}
                                onChange={event => handleNameInputChange(event.target.value)}
                                readOnly={mode === 'view'}
                            />
                        </Field>
                        <Field orientation="horizontal">
                            <FieldLabel htmlFor="make">Make</FieldLabel>
                            <Input 
                                id="name" 
                                placeholder="Engine 240" 
                                value={name}
                                onChange={event => handleNameInputChange(event.target.value)}
                                readOnly={mode === 'view'}
                            />
                        </Field>
                    </FieldGroup>
                </FieldGroup>
            </FieldGroup>
        </FieldSet>
    )
}  