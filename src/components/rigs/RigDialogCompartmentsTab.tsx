
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

import { type Rig } from '@/models/Rig'

import { type CompartmentsState, } from './RigDialog';


interface RigDialogCompartmentsTabProps {
	mode: string,
	rig?: Rig,
	compartments: CompartmentsState,
	setCompartments: (previousCompartments: CompartmentsState) => void
}

export function RigDialogCompartmentsTab({
	mode,
	compartments,
	setCompartments
}: RigDialogCompartmentsTabProps) {



	console.log('compartments are: ', compartments)

	return (
		<Accordion
			className="max-w-lg"
		>
			<FieldSet>
				{COMPARTMENT_GROUPS.map((group) => {
					return (
						<>
							<AccordionItem value={group.key}>
								<AccordionTrigger>{group.label}</AccordionTrigger>
								<AccordionContent>
									<FieldGroup>

										{compartments[group.key] && compartments[group.key].map((compartment) => {
											return (
												<Field key={compartment.reactKey} orientation="horizontal" >
													{mode === 'view' ? 
														<div className="flex items-center gap-3">
																	<span className="text-xs uppercase tracking-wide font-semibold">
																			{compartment.position}
																	</span>

																	<p className="text-sm">
																			{compartment.name}
																	</p>
														</div> :
														<>
															<FieldLabel className="	" htmlFor={compartment.reactKey}>{compartment.position} </FieldLabel>
															<Input
																id={compartment.reactKey}
																placeholder={group.placeholder}
																value={compartment?.name}
																onChange={event => handleNewCompartmentInputChange(compartment.reactKey, group.key, event.target.value)}
															/>
															<Button type="button" size="icon" variant="destructive" onClick={() => handleRemoveCompartment(compartment.reactKey, group.key)}>
																<Trash2 className="h-4 w-4" />
															</Button>
														</>
													}
												</Field>
											)
										})}

									</FieldGroup>
									{ mode === 'edit' && 

									<FieldGroup>
										<Field orientation="horizontal">
											<Button type="button" variant="outline" onClick={() => handleAddNewCompartment(group.key)}>
												<PlusIcon
													className="h-4 w-4" /> Add Compartment
											</Button>
										</Field>
									</FieldGroup>}
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
				return compartment.reactKey === reactKey ? { ...compartment, name } : compartment
			})
		}))
	}

	function handleRemoveCompartment(reactKey: string, groupKey: CompartmentGroupKey) {
		if (compartments[groupKey].length == 1) {
			setValidationErrors(['You must have atleast one compartment'])
			return
		}

		setCompartments(previousCompartments => ({
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