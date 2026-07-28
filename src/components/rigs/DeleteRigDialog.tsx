import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import type { Rig } from "@/models/Rig"

interface DeleteRigDialogProps {
    rig: Rig
    open: boolean;
    onOpenChange: (open: boolean) => void;
    deleteRig: (rigId: string) => void;
}

export function DeleteRigDialog({ rig, open, onOpenChange, deleteRig }: DeleteRigDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{`Delete ${rig.name}?`}</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. All compartments will be removed and equipment unassigned. Are you sure you want to continue?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => deleteRig(rig.id)}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
