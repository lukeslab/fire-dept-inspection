import { useState } from "react";

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

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
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);


    return (
      <>

        <RigDialog mode='edit' open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} rigId={rig.id} loadRigs={loadRigs}/>

        <DeleteRigDialog rig={rig} open={isConfirmOpen} onOpenChange={setIsConfirmOpen} deleteRig={deleteRig} />

        <Card className="w-full max-w-sm">
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
          
        </Card>
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
