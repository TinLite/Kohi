import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { ModeToggle } from "./mode-toggle"

export const SheetSetting = ({open, onOpenChange, side = "left"}: {open: boolean, onOpenChange: (open: boolean) => void, side: "top" | "bottom" | "left" | "right"}) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side={side}>
        <SheetHeader>
          <SheetTitle>Cài đặt</SheetTitle>
          <SheetDescription>
            Tuỳ chỉnh ứng dụng theo cách của bạn
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="setting-mode-toggle" className="text-right">
              Chế độ
            </Label>
            <div id="setting-mode-toggle" className="col-span-3 grid">
                <ModeToggle />
            </div>
          </div>
        </div>
        {/* <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose>
        </SheetFooter> */}
      </SheetContent>
    </Sheet>
  )
}
