import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import socket from "@/services/socket";
const UserNoti = ({ children }: { children: React.ReactNode }) => {
  // Tạo NotificationItem bên trong component UserNoti
  const NotificationItem = ({
    title,
    time,
    action,
  }: {
    title: string;
    time: string;
    action?: string;
  }) => (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center">
        <Avatar className="w-10 h-10">
          <AvatarImage src="https://github.com/QuangTeoo.png" />
          <AvatarFallback>?</AvatarFallback>
        </Avatar>
        <div className="ml-3">
          <p className="text-sm font-medium">{title}</p>
          <p className="text-xs text-muted-foreground">{time}</p>
        </div>
      </div>
      <div className="flex items-center">
        {action && (
          <Button variant="secondary" size="sm" className="ml-2">
            {action}
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="p-1">
              <MoreHorizontal className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onSelect={() => console.log("Đánh dấu quan trọng")}
            >
              Đánh dấu quan trọng
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => console.log("Xóa thông báo")}>
              Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );

  return (
    <div>
      <Sheet>
        <SheetTrigger asChild>{children}</SheetTrigger>
        <SheetContent side="left" className="w-[350px] flex flex-col">
          <SheetHeader className="px-4">
            <SheetTitle className="text-lg">Thông báo</SheetTitle>
          </SheetHeader>
          <Tabs defaultValue="all" className="flex-1">
            <TabsList className="px-4">
              <TabsTrigger value="all">Tất cả</TabsTrigger>
              <TabsTrigger value="unread">Chưa đọc</TabsTrigger>
            </TabsList>

            <ScrollArea className="flex-1 px-4 py-2">
              <TabsContent value="all">
                <p className="font-medium text-sm mb-2">Mới</p>
                <NotificationItem
                  title="Vựa Cua Đăng Quân đã thêm 13 ảnh mới"
                  time="34 phút trước"
                />
                <NotificationItem
                  title="Vựa Cua Đăng Quân đã thêm một video mới"
                  time="27 phút trước"
                />
                <Separator className="my-2" />
                <p className="font-medium text-sm mb-2">Trước đó</p>
                <NotificationItem
                  title="Nguyễn Ngọc Long đã chấp nhận lời mời"
                  time="13 giờ trước"
                />
                <NotificationItem
                  title="Thanh Loc đã thêm vào tin của mình"
                  time="17 giờ trước"
                />
              </TabsContent>
              <TabsContent value="unread">
                <NotificationItem
                  title="Vựa Cua Đăng Quân đã thêm 13 ảnh mới"
                  time="34 phút trước"
                />
                <NotificationItem
                  title="Nguyễn Ngọc Long đã chấp nhận lời mời"
                  time="13 giờ trước"
                />
              </TabsContent>
            </ScrollArea>

            <Separator />
            <div className="p-4">
              <Button variant="outline" className="w-full">
                Xem thông báo trước đó
              </Button>
            </div>
          </Tabs>
        </SheetContent>
      </Sheet>
    </div>
  );
};
export default UserNoti;
