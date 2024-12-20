import { MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useContext, useEffect, useState } from "react";
import {
  deleteNotification,
  getAllNotifications,
  readNotification,
} from "@/repository/notification-repository";
import { UserContext } from "@/context/user-context";
import { get } from "http";

const UserNoti = ({
  open,
  onOpenChange,
  side = "left",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  side?: "top" | "bottom" | "left" | "right";
}) => {
  const { user } = useContext(UserContext);
  const [notifications, setNotifications] = useState<any[]>([]);
  const fetchNotifications = async () => {
    if (!user) {
      console.error("User not logged in");
      return;
    }
    try {
      const response = await getAllNotifications();
      setNotifications(response);
    } catch (err) {
      console.error(err);
    }
  };
  const handleReadNotification = async (id: string) => {
    return readNotification(id).then(fetchNotifications);
  };
  const handleDeleteNotification = async (id: string) => {
    return deleteNotification(id).then(fetchNotifications);
  };
  useEffect(() => {
    fetchNotifications();
  }, [user]);

  const NotificationItem = ({
    type,
    title,
    time,
    action,
    id,
  }: {
    type: boolean;
    title: string;
    time: string;
    action?: string;
    id: string;
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
            {type === true ? (
              <DropdownMenuItem onClick={() => handleDeleteNotification(id)}>
                Xóa
              </DropdownMenuItem>
            ) : (
              <>
                <DropdownMenuItem onClick={() => handleReadNotification(id)}>
                  Đánh dấu chưa đọc
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleReadNotification(id)}>
                  Xóa
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side={side} className="w-[350px] flex flex-col">
        <SheetHeader className="px-4">
          <SheetTitle className="text-lg">Thông báo</SheetTitle>
        </SheetHeader>
        <Tabs defaultValue="all" className="flex-1">
          <TabsList className="px-4">
            <TabsTrigger value="all">Tất cả</TabsTrigger>
            <TabsTrigger value="unread">Chưa đọc</TabsTrigger>
          </TabsList>
          <ScrollArea className="flex-1 py-2">
            <TabsContent value="all">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <NotificationItem
                    key={notification._id}
                    title={
                      notification.type === "NEW_FOLLOWER"
                        ? `${notification.otherUser.displayName} đã theo dõi bạn`
                        : notification.type === "LIKE_POST"
                        ? `${notification.otherUser.displayName} đã thích bài viết của bạn`
                        : notification.type === "NEW_POST"
                        ? `${notification.otherUser.displayName} đã đăng một bài viết mới`
                        : notification.type === "NEW_COMMENT"
                        ? `${notification.otherUser.displayName} đã bình luận về bài viết của bạn`
                        : notification.type === "LIKE_COMMENT"
                        ? `${notification.otherUser.displayName} đã thích bình luận của bạn`
                        : "Thông báo khác"
                    }
                    time={new Date(notification.createAt).toLocaleString(
                      "vi-VN"
                    )}
                    type={notification.isRead}
                    id={notification._id}
                  />
                ))
              ) : (
                <p className="text-muted-foreground text-sm">
                  Không có thông báo nào.
                </p>
              )}
            </TabsContent>
            <TabsContent value="unread">
              {notifications.filter((noti) => noti.isRead === false).length >
              0 ? (
                notifications
                  .filter((noti) => noti.isRead === false)
                  .map((notification) => (
                    <NotificationItem
                      key={notification._id}
                      title={
                        notification.type === "NEW_FOLLOWER"
                          ? `${notification.otherUser.displayName} đã theo dõi bạn`
                          : notification.type === "LIKE_POST"
                          ? `${notification.otherUser.displayName} đã thích bài viết của bạn`
                          : notification.type === "NEW_POST"
                          ? `${notification.otherUser.displayName} đã đăng một bài viết mới`
                          : notification.type === "NEW_COMMENT"
                          ? `${notification.otherUser.displayName} đã bình luận về bài viết của bạn`
                          : notification.type === "LIKE_COMMENT"
                          ? `${notification.otherUser.displayName} đã thích bình luận của bạn`
                          : "Thông báo khác"
                      }
                      time={new Date(notification.createAt).toLocaleString()}
                      id={notification._id}
                      type={notification.isRead}
                    />
                  ))
              ) : (
                <p className="text-muted-foreground text-sm">
                  Không có thông báo nào chưa đọc.
                </p>
              )}
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
  );
};

export default UserNoti;
