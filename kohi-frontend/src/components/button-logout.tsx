import { LogOut } from "lucide-react";
import { Button } from "./ui/button";

export function ButtonLogout() {
    return (
        <Button variant="destructive"><LogOut className="w-4 h-4 mr-2" />Đăng xuất</Button>
    )
}