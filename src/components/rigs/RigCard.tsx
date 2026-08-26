import { useState } from "react";

import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"

import type { Rig } from "@/models/Rig"

import { DeleteRigDialog } from "./DeleteRigDialog"
import { RigDialog } from './RigDialog'

interface RigCardProps {
  rig: Rig;
  onDeleteError: (message: string) => void;
  loadRigs: () => void;
}

export function RigCard({rig, onDeleteError, loadRigs }: RigCardProps) {

    const [isDeleting, setIsDeleting] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [imageLoading, setImageLoading] = useState(true)


    return (
      <>
        {isDialogOpen && <RigDialog mode='view' open={isDialogOpen} onOpenChange={setIsDialogOpen} rigId={rig.id} loadRigs={loadRigs}/>}

        <DeleteRigDialog rig={rig} open={isConfirmOpen} onOpenChange={setIsConfirmOpen} deleteRig={deleteRig} />

        <Item 
            key={rig.id} 
            role="listitem"
            className="items-stretch py-4"
        >
            <ItemMedia
                className="w-52 shrink-0 self-stretch"
            >
                {imageLoading && <Spinner /> }
                <img
                  src={rig.image_url}
                  alt={`image of ${rig.name}`}
                  className="h-full w-full object-contain"
                  loading="lazy"
                  onLoad={() => setImageLoading(false)}
                />
            </ItemMedia>
            <ItemContent>
                <ItemTitle>{rig.name}</ItemTitle>
                <ItemDescription>Description for {rig.name}</ItemDescription>
            </ItemContent>
            <ItemActions>
                <Button
                  onClick={() => setIsDialogOpen(true)}
                 >View</Button>
            </ItemActions>
        </Item>
      </>
    )

  async function deleteRig(rigId: string) {
    setIsDeleting(true)
    setIsConfirmOpen(false)
    
    try {
      const options = {
        method: "DELETE"
      }
      const response = await fetch(`/api/rigs?id=${rigId}`, options)

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Server failed to delete rig.")
      }

      await loadRigs()

    } catch (err) {
      if (err instanceof Error) {
        onDeleteError(err.message)

      }
    }
  }
}
