import { COMPARTMENT_GROUPS } from "../lib/db/compartmentGroups.ts";

type CompartmentGroupKey = (typeof COMPARTMENT_GROUPS)[number]['key']

export interface Compartment {
    id: string;
    rigId: string;
    name: string;
    position: number;
    group_key: CompartmentGroupKey;
}