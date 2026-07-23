import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface CreateRigDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CreateRigDialog({
    open,
    onOpenChange,
}: CreateRigDialogProps) {
    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Rig</DialogTitle>

                    <DialogDescription>
                        Add a new apparatus and its compartments.
                    </DialogDescription>
                </DialogHeader>

                {/* TODO: Add the rig form here */}
            </DialogContent>
        </Dialog>
    );
}