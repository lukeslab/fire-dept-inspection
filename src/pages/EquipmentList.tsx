import { useEffect, useState } from "react";

import { useRigs } from "@/hooks/hooks";
import { AppPage } from "@/components/application/AppPage";
import { PageHeader } from "@/components/application/PageHeader";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { BadgeCheckIcon, ChevronRightIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"

import { COMPARTMENT_GROUPS} from "@/lib/db/compartmentGroups"

interface Equipment{
    name: string,
    function: boolean,
    quantity: number,
    compartment_id: string
}

export default function EquipmentList() {

    const { rigs, isLoading: isLoadingRigs, error: loadRigsError, loadRigs } = useRigs();
    const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
    const [ viewMode, setViewMode ] = useState<'catalog' | 'by-rig'>('by-rig')
    const [equipmentData, setEquipmentData] = useState<any[]>([])


    useEffect( () => {
        loadRigs()
        // if (viewMode === 'by-rig') loadEquipmentByRig()
        // else loadEquipmentCatalog()
    }, [viewMode])

    return (
        <AppPage>
            <PageHeader
                title="Equipment"
                description="Manage equipment assignments."
            />
            {rigs.map( rig => (
                 <Item 
                    key={rig.id} 
                    role="listitem"
                    className="items-stretch py-4"
                >
                    <ItemMedia
                        className="w-52 shrink-0 self-stretch"
                    >
                        <img
                        src={rig.image_url}
                        alt={`image of ${rig.name}`}
                        className="h-full w-full object-contain"
                        />
                    </ItemMedia>
                    <ItemContent>
                        <ItemTitle>{rig.name}</ItemTitle>
                        <ItemDescription>Description for {rig.name}</ItemDescription>
                    </ItemContent>
                    <ItemActions>
                        <Button>View</Button>
                    </ItemActions>
                </Item>

            // <Accordion 
            //     className="max-w-lg"
            //     multiple={true}
            //     onValueChange={(value) => loadEquipmentByRig(value)}
            //     >
            //     <Card className="w-full max-w-sm">
            //         <CardHeader>
            //             <CardTitle>{rig.name}</CardTitle>
            //             <CardDescription>Compartments</CardDescription>
            //         </CardHeader>
            //         <CardContent>
            //         {COMPARTMENT_GROUPS.map( group => (
            //             <AccordionItem value={group?.key}>
            //                 <AccordionTrigger>{group.label}</AccordionTrigger>
            //                 <AccordionContent>
            //                     <Item variant="outline">
            //                         <ItemContent>
            //                             <ItemTitle>Haligan</ItemTitle>
            //                             <ItemDescription>
            //                             Forcible entry tool.
            //                             </ItemDescription>
            //                         </ItemContent>
            //                         <ItemActions>
            //                             <Button variant="outline" size="sm">
            //                             Action
            //                             </Button>
            //                         </ItemActions>
            //                     </Item>
            //                 </AccordionContent>
            //             </AccordionItem>
            //         ))}
            //         </CardContent>
            //     </Card>
            // </Accordion>
            ))}
            {/* <Accordion>
                <AccordionItem value="support">
                    <AccordionTrigger>
                        Unassigned
                    </AccordionTrigger>
                    <AccordionContent>
                       <Item variant="outline">
                            <ItemContent>
                                <ItemTitle>Haligan</ItemTitle>
                                <ItemDescription>
                                Forcible entry tool.
                                </ItemDescription>
                            </ItemContent>
                            <ItemActions>
                                <Button variant="outline" size="sm">
                                Action
                                </Button>
                            </ItemActions>
                        </Item>
                    </AccordionContent>
                </AccordionItem>
            </Accordion> */}
        </AppPage>
    );

    async function loadEquipmentByRig(rigId: string | string[]) {
        const id = Array.isArray(rigId) ? rigId[0] : rigId;
        const equipmentByRig = await fetch(`/api/equipment?id=${id}`)

        return equipmentByRig

    }


    // This function is for the catalog view.
    async function loadEquipmentCatalog() {

    }
}