import { AppPage } from "@/components/application/AppPage";
import { PageHeader } from "@/components/application/PageHeader";
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

export default function EquipmentList() {
    return (
        <AppPage>
            <PageHeader
                title="Equpiment"
                description="Manage equipment assignments."
            />
            <Accordion 
                className="max-w-lg"
                multiple={true}
                >
                <AccordionItem value="shipping">
                    <AccordionTrigger>Engine 241</AccordionTrigger>
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
                <AccordionItem value="returns">
                    <AccordionTrigger>
                        Rescue 30
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
            </Accordion>
        </AppPage>
    );
}