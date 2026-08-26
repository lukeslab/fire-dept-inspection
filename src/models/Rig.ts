import { type Compartment } from "./Compartment"

export interface Rig {
    id: string,
    name: string,
    compartments: Compartment[]
    image_url: string,
    year: string,
    make: string,
};