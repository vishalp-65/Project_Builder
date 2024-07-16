import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface dataRepo {
    name: string;
    clone_url: string;
}

interface dialogBar {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    data: dataRepo;
}

export function DialogBar({ open, setOpen, data }: dialogBar) {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add custom Domain</DialogTitle>
                    <DialogDescription>
                        You can add your custom domain if you want.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Custom Domain
                        </Label>
                        <Input
                            id="name"
                            value=""
                            type="text"
                            className="col-span-3"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit">Create project</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
