import { UserContext } from "@/context/user-context";
import {
  deleteAllNotifications,
  deleteNotification,
  getAllNotifications,
  readAllNotifications,
  readNotification,
} from "@/repository/notification-repository";
import socket from "@/services/socket";
import { Notification } from "@/types/notification-types";
import { SocketEvent } from "@/types/socket-types";
import { EllipsisVertical } from "lucide-react";
import { DateTime } from "luxon";
import { useContext, useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

const UserNotification = ({
  open,
  onOpenChange,
  side = "left",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  side?: "top" | "bottom" | "left" | "right";
}) => {
  const { user } = useContext(UserContext);
  const [notificationList, setNotificationList] = useReducer(
    (
      state: Notification[],
      action: {
        type: "add" | "delete" | "update" | "set" | "prepend" | "append";
        payload: Notification[];
      }
    ) => {
      switch (action.type) {
        case "prepend":
          return [...action.payload, ...state];
        case "append":
          return [...state, ...action.payload];
        case "add":
          return [...state, ...action.payload];
        case "delete":
          const ids = action.payload.map((noti) => noti._id);
          return state.filter((noti) => !ids.includes(noti._id));
        case "update":
          return state.map(
            (noti) => action.payload.find((n) => n._id === noti._id) || noti
          );
        case "set":
          return action.payload;
      }
    },
    []
  );
  const fetchNotifications = async () => {
    if (!user) {
      console.error("User not logged in");
      return;
    }
    try {
      const response = await getAllNotifications();
      setNotificationList({ type: "set", payload: response ?? [] });
    } catch (err) {
      console.error(err);
    }
  };
  const refreshNotifications = async () => {
    fetchNotifications();
  };

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  useEffect(() => {
    socket.on(
      SocketEvent.NOTIFICATION_COMMENT_NEWCOMMENT,
      (notification: Notification) => {
        setNotificationList({ type: "prepend", payload: [notification] });
        const newComment = JSON.parse(JSON.stringify(notification));
        toast.success(
          `${
            newComment.otherUser?.displayName ?? newComment.otherUser?.username
          } commented on your post`
        );
      }
    );
    socket.on(
      SocketEvent.NOTIFICATION_COMMENT_LIKECOMMENT,
      (notification: Notification) => {
        setNotificationList({ type: "prepend", payload: [notification] });
        const newComment = JSON.parse(JSON.stringify(notification));
        toast.success(
          `${
            newComment.otherUser?.displayName ?? newComment.otherUser?.username
          } liked your comment`
        );
      }
    );
    socket.on(
      SocketEvent.NOTIFICATION_COMMENT_REPLYCOMMENT,
      (notification: Notification) => {
        setNotificationList({ type: "prepend", payload: [notification] });
        const newComment = JSON.parse(JSON.stringify(notification));
        toast.success(
          `${
            newComment.otherUser?.displayName ?? newComment.otherUser?.username
          } replied to your comment`
        );
      }
    );
    socket.on(
      SocketEvent.NOTIFICATION_POST_NEWPOST,
      (notification: Notification) => {
        setNotificationList({ type: "prepend", payload: [notification] });
        const newComment = JSON.parse(JSON.stringify(notification));
        toast.success(
          `${
            newComment.otherUser?.displayName ?? newComment.otherUser?.username
          } posted a new post`
        );
      }
    );
    socket.on(
      SocketEvent.NOTIFICATION_POST_LIKEPOST,
      (notification: Notification) => {
        setNotificationList({ type: "prepend", payload: [notification] });
        const newComment = JSON.parse(JSON.stringify(notification));
        toast.success(
          `${
            newComment.otherUser?.displayName ?? newComment.otherUser?.username
          } liked your post`
        );
      }
    );
    socket.on(
      SocketEvent.NOTIFICATION_FOLLOW_NEWFOLLOW,
      (notification: Notification) => {
        setNotificationList({ type: "prepend", payload: [notification] });
        const newComment = JSON.parse(JSON.stringify(notification));
        toast.success(
          `${
            newComment.otherUser?.displayName ?? newComment.otherUser?.username
          } started following you`
        );
      }
    );
    console.log("socket on notification");
    return () => {
      socket.off(SocketEvent.NOTIFICATION_COMMENT_NEWCOMMENT);
      socket.off(SocketEvent.NOTIFICATION_COMMENT_LIKECOMMENT);
      socket.off(SocketEvent.NOTIFICATION_COMMENT_REPLYCOMMENT);
      socket.off(SocketEvent.NOTIFICATION_POST_NEWPOST);
      socket.off(SocketEvent.NOTIFICATION_POST_LIKEPOST);
      socket.off(SocketEvent.NOTIFICATION_FOLLOW_NEWFOLLOW);
    };
  }, []);
  const handleReadAllNotification = async () => {
    return readAllNotifications().then(fetchNotifications);
  };
  const handleDeleteAllNotification = async () => {
    return deleteAllNotifications().then(fetchNotifications);
  }
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side={side} className="w-[350px] flex flex-col">
        <SheetHeader className="px-4">
          <SheetTitle className="text-lg">Notifications</SheetTitle>
        </SheetHeader>
        <div className="flex justify-between items-center px-4 py-2">
          <h2 className="text-sm font-bold">Mới nhất</h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="p-1">
                <EllipsisVertical className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="z-50" >
              <DropdownMenuItem
                onClick={() => handleReadAllNotification()}
               className="hover:bg-accent"
              >
                Đánh dấu tất cả đã đọc
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDeleteAllNotification()}
                className="hover:bg-accent"
              >
                Xóa tất cả
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <ScrollArea className="overflow-y-auto h-[500px] pr-2">
          {user && notificationList.length > 0 ? (
            notificationList.map((notification) => (
              <NotificationList
                key={notification._id}
                Notification={notification}
                onRefresh={refreshNotifications}
                onClose={() => onOpenChange(false)} // Đóng Sheet khi focus
              />
            ))
          ) : (
            <p className="text-muted-foreground text-sm">
              Không có thông báo nào.
            </p>
          )}
        </ScrollArea>

        <Separator />
      </SheetContent>
    </Sheet>
  );
};
export default UserNotification;
export function NotificationList({
  Notification,
  onRefresh,
  onClose,
}: {
  Notification: Notification;
  onRefresh?: () => void;
  onClose?: () => void;
}) {
  const navigate = useNavigate();
  const [focusedCommentId, setFocusedCommentId] = useState<string | null>(null);
  const handleReadNotification = async (id: string) => {
    try {
      await readNotification(id);
      if (onRefresh) {
        onRefresh();
      }
    } catch (err) {
      console.error(err);
    }
  };
  const handleDeleteNotification = async (id: string) => {
    try {
      await deleteNotification(id);
      if (onRefresh) {
        onRefresh();
      }
    } catch (err) {
      console.error(err);
    }
  };
  const handleFocus = () => {
    handleReadNotification(Notification._id);
    setFocusedCommentId(Notification.comment?._id ?? null);
    switch (Notification.type) {
      case "NEW_COMMENT":
      case "LIKE_COMMENT":
      case "NEW_REPLY_COMMENT":
        if (Notification.post && Notification.comment) {
          navigate(`/post/detail/${Notification.post}#comment`, {
            state: { commentId: Notification.comment },
          });
        } else {
          toast.error("Không thể điều hướng đến bài viết hoặc bình luận.");
        }
        break;
      case "NEW_FOLLOWER":
        navigate(`/profile/${Notification.otherUser?._id}`);
        break;
      case "LIKE_POST":
      case "NEW_POST":
        navigate(`/post/detail/${Notification.post}`);
        break;
      default:
        console.log("Unknown notification type");
    }
    if (onClose) {
      onClose();
    }
  };
  return (
    <div
      className={`flex items-center px-4 py-3 mb-2 rounded-md ${
        Notification.isRead ? "bg-gray-100 text-muted-foreground" : ""
      }`}
    >
      <div className="flex items-center">
        <Avatar className="w-10 h-10">
          <AvatarImage
            src={
              Notification.otherUser?.avatar ??
              "https://github.com/QuangTeoo.png"
            }
          />
          <AvatarFallback>?</AvatarFallback>
        </Avatar>
        <div className="ml-2">
          <p className="text-sm font-medium" onClick={handleFocus}>
            {!Notification.isRead && (
              <span className="text-primary font-bold mr-2">Mới</span>
            )}
            {Notification.type === "NEW_FOLLOWER"
              ? `${Notification.otherUser?.displayName} started following you`
              : Notification.type === "LIKE_POST"
              ? `${Notification.otherUser?.displayName} liked your post`
              : Notification.type === "NEW_POST"
              ? `${Notification.otherUser?.displayName} posted a new post`
              : Notification.type === "NEW_COMMENT"
              ? `${Notification.otherUser?.displayName} commented on your post`
              : Notification.type === "LIKE_COMMENT"
              ? `${Notification.otherUser?.displayName} liked your comment`
              : Notification.type === "NEW_REPLY_COMMENT"
              ? `${Notification.otherUser?.displayName} replied to your comment`
              : "Other notification"}
          </p>
          <p className="text-xs text-muted-foreground">
            {DateTime.fromISO(Notification.createAt.toString()).toRelative() ??
              " "}
          </p>
        </div>
      </div>
      <div className="flex items-center ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="p-1">
              <EllipsisVertical className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => handleReadNotification(Notification._id)}
              className="hover:bg-accent" 
            >
              Đánh dấu đã đọc
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDeleteNotification(Notification._id)}
              className="hover:bg-accent"
            >
              Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
