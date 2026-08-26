import { useState } from "react";

import { Button } from "@/components/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"

import { RigDialog } from './RigDialog'
import { DeleteRigDialog } from "@/components/rigs/DeleteRigDialog"

import type { Rig } from "@/models/Rig"

interface RigCardProps {
  rig: Rig;
  onDeleteError: (message: string) => void;
  loadRigs: () => void;
}

export function RigCard({rig, onDeleteError, loadRigs }: RigCardProps) {

    const [isDeleting, setIsDeleting] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);


    return (
      <>

        <RigDialog mode='view' open={isDialogOpen} onOpenChange={setIsDialogOpen} rigId={rig.id} loadRigs={loadRigs}/>

        <DeleteRigDialog rig={rig} open={isConfirmOpen} onOpenChange={setIsConfirmOpen} deleteRig={deleteRig} />

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
                <Button
                  onClick={() => setIsDialogOpen(true)}
                 >View</Button>
            </ItemActions>
        </Item>

        {/* <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>{rig.name}</CardTitle>
            <CardDescription>
              Manage rig {rig.name}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Button
              onClick={() => setIsEditDialogOpen(true)}
            >
              Edit
            </Button>
            <Button
              onClick={() => setIsConfirmOpen(true)}
              variant="destructive"
              disabled={isDeleting}
            >
              {isDeleting ? "Removing..." : "Remove"}
            </Button>
          </CardContent>
          
          <CardFooter className="flex-col gap-2">
        
          </CardFooter>
          
        </Card> */}
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
