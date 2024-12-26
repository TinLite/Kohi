import { useTheme } from "@/components/theme-provider";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";

export function PageSettingApp() {
    const {theme, setTheme} = useTheme();
    const [language, setLanguage] = useState("en");
    useEffect(() => {
        setLanguage(localStorage.getItem("language") || "en");
    }, [language]);
    return (
        <div className="mx-auto w-screen max-w-2xl px-4">
            <div className="py-4">
                <h1 className="text-xl">App settings</h1>
                <p className="text-muted-foreground">
                    Configure how the site behaves and looks. These settings will not be synced across devices.
                </p>
            </div>
            <div className="grid grid-cols-5 md:grid-cols-4 justify-items-end items-center gap-4">
                <Label className="col-span-2 md:col-auto" htmlFor="app-theme">App theme</Label>
                <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger className="col-span-3" id="app-theme">
                        <SelectValue>{theme === "light" ? "Light" : theme === "dark" ? "Dark" : "System"}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                </Select>
                <Label className="col-span-2 md:col-auto" htmlFor="app-language">Language</Label>
                <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger className="col-span-3" id="app-theme" disabled>
                        <SelectValue></SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="vi">Vietnamese (Tiếng Việt)</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}