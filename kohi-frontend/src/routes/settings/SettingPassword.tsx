import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updatePassword } from "@/repository/user-repository";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function PageSettingPassword() {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [retypePassword, setRetypePassword] = useState("");
    const [isPending, setIsPending] = useState(false);
    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (newPassword !== retypePassword) {
            toast.error("New passwords do not match");
            return;
        }

        setIsPending(true);

        setTimeout(() => {
            updatePassword(oldPassword, newPassword).then(() => {
                toast.success("Password updated successfully");
                setOldPassword("");
                setNewPassword("");
                setRetypePassword("");
            }).catch((error) => {
                toast.error(error.message);
            }).finally(() => {
                setIsPending(false);
            });
        }, 1000);
    }

    return (
        <div className="mx-auto w-screen max-w-2xl px-2">
            <div className="py-4">
                <h1 className="text-xl">Password</h1>
                <p className="text-muted-foreground">
                    Change your password here
                </p>
            </div>
            <form onSubmit={onSubmit} className="grid grid-cols-5 md:grid-cols-4 justify-items-end items-center gap-4">
                <Label className="col-span-2 md:col-auto" htmlFor="old-password">Old password</Label>
                <Input
                    className="col-span-3"
                    id="old-password"
                    placeholder="Your current password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    disabled={isPending}
                />
                <Label className="col-span-2 md:col-auto" htmlFor="new-password">New password</Label>
                <Input
                    className="col-span-3"
                    id="new-password"
                    placeholder="Your new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={isPending}
                />
                <Label className="col-span-2 md:col-auto" htmlFor="retype-password">Retype password</Label>
                <Input
                    className="col-span-3"
                    id="retype-password"
                    placeholder="Retype your new password"
                    value={retypePassword}
                    onChange={(e) => setRetypePassword(e.target.value)}
                    disabled={isPending}
                />
                <Button type="submit" className="col-span-full" disabled={!oldPassword || !newPassword || !retypePassword || isPending}>
                    {isPending ? <>
                        <LoaderCircle className="animate-spin inline-block" size={16} />
                    </> : "Change password"}
                </Button>
            </form>
        </div>
    );
}