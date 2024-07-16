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
    customDomain: string;
    gitURL: string;
}

interface dialogBar {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    data: dataRepo;
    setData: React.Dispatch<React.SetStateAction<dataRepo>>;
    handleCreateClick: () => void;
}

export function DialogBar({
    open,
    setOpen,
    data,
    setData,
    handleCreateClick,
}: dialogBar) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const updatedData = { ...data, customDomain: e.target.value };
        setData(updatedData);
    };

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
                            value={data.customDomain}
                            type="text"
                            className="col-span-3"
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={handleCreateClick}>
                        Create project
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
