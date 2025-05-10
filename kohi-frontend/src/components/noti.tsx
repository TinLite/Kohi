import { UserContext } from "@/context/user-context";
import {
  deleteNotification,
  getAllNotifications,
  readNotification,
} from "@/repository/notification-repository";
import socket from "@/services/socket";
import { Notification } from "@/types/notification-types";
import { SocketEvent } from "@/types/socket-types";
import { MoreHorizontal } from "lucide-react";
import { DateTime } from "luxon";
import { useContext, useEffect, useReducer } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
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
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
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
  const handleReadNotification = async (id: string) => {
    return readNotification(id).then(fetchNotifications);
  };
  const handleDeleteNotification = async (id: string) => {
    return deleteNotification(id).then(fetchNotifications);
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
  const NotificationItem = ({
    user,
    type,
    title,
    time,
    action,
    id,
    flur,
    onClickFocus,
  }: {
    user: string;
    type: boolean;
    title: string;
    time: string;
    action?: string;
    id: string;
    flur?: string;
    onClickFocus?: () => void;
  }) => (
    <div
      className={`flex items-center px-4 py-3 mb-2 rounded-md ${
        type ? "text-muted-foreground" : ""
      }`}
    >
      <div className="flex items-center">
        <Avatar className="w-10 h-10">
          <AvatarImage src={user} />
          <AvatarFallback>?</AvatarFallback>
        </Avatar>
        <div className="ml-2">
          <p className="text-sm font-medium" onClick={onClickFocus}>
            {!type && (
              <Badge variant="outline" className="mr-2">
                New
              </Badge>
            )}{" "}
            {title}
          </p>
          <p className="text-xs text-muted-foreground">{time}</p>
        </div>
      </div>
      <div className="flex items-center ml-auto">
        {action && (
          <Button variant="secondary" size="sm" className="">
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
            <DropdownMenuItem onClick={() => handleReadNotification(id)}>
              Đánh dấu đã đọc
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDeleteNotification(id)}>
              Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
  console.log("Notification rerender");
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side={side} className="w-[350px] flex flex-col">
        <SheetHeader className="px-4">
          <SheetTitle className="text-lg">Notifications</SheetTitle>
        </SheetHeader>
        <Tabs defaultValue="all" className="flex-1">
          <TabsList className="px-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <ScrollArea className="overflow-y-auto h-[500px] pr-2">
              {user && notificationList.length > 0 ? (
                notificationList.map((notification) => (
                  <NotificationItem
                    key={notification._id}
                    title={
                      notification.type === "NEW_FOLLOWER"
                        ? `${notification.otherUser?.displayName} started following you`
                        : notification.type === "LIKE_POST"
                        ? `${notification.otherUser?.displayName} liked your post`
                        : notification.type === "NEW_POST"
                        ? `${notification.otherUser?.displayName} posted a new post`
                        : notification.type === "NEW_COMMENT"
                        ? `${notification.otherUser?.displayName} commented on your post`
                        : notification.type === "LIKE_COMMENT"
                        ? `${notification.otherUser?.displayName} liked your comment`
                        : notification.type === "NEW_REPLY_COMMENT"
                        ? `${notification.otherUser?.displayName} replied to your comment`
                        : "Other notification"
                    }
                    time={
                      DateTime.fromISO(
                        notification.createAt.toString()
                      ).toRelative() ?? ""
                    }
                    type={notification.isRead}
                    id={notification._id}
                    flur={!notification.isRead ? "Blur" : ""}
                    user={notification.otherUser?.avatar ?? ""}
                    onClickFocus={() => {
                      switch (notification.type) {
                        case "NEW_COMMENT":
                        case "LIKE_COMMENT":
                        case "NEW_REPLY_COMMENT":
                          if (notification.post && notification.comment) {
                            navigate(
                              `/post/detail/${notification.post}#comment`,
                              {
                                state: { commentId: notification.comment },
                              }
                            );
                          } else {
                            toast.error(
                              "Không thể điều hướng đến bài viết hoặc bình luận."
                            );
                          }
                          break;
                        case "NEW_FOLLOWER":
                          navigate(`/profile/${notification.otherUser?._id}`);
                          break;
                        case "LIKE_POST":
                        case "NEW_POST":
                          navigate(`/post/detail/${notification.post}`);
                          break;
                        default:
                          console.log("Unknown notification type");
                      }
                    }}
                  />
                ))
              ) : (
                <p className="text-muted-foreground text-sm">
                  Không có thông báo nào.
                </p>
              )}
            </ScrollArea>
          </TabsContent>
          <TabsContent value="unread">
            <ScrollArea className="overflow-y-auto h-[500px]">
              {notificationList.filter((noti) => noti.isRead === false).length >
              0 ? (
                notificationList
                  .filter((noti) => noti.isRead === false)
                  .map((notification) => (
                    <NotificationItem
                      key={notification._id}
                      title={
                        notification.type === "NEW_FOLLOWER"
                          ? `${notification.otherUser?.displayName} started following you`
                          : notification.type === "LIKE_POST"
                          ? `${notification.otherUser?.displayName} liked your post`
                          : notification.type === "NEW_POST"
                          ? `${notification.otherUser?.displayName} posted a new post`
                          : notification.type === "NEW_COMMENT"
                          ? `${notification.otherUser?.displayName} commented on your post`
                          : notification.type === "LIKE_COMMENT"
                          ? `${notification.otherUser?.displayName} liked your comment`
                          : notification.type === "NEW_REPLY_COMMENT"
                          ? `${notification.otherUser?.displayName} replied to your comment`
                          : "Other notification"
                      }
                      time={new Date(notification.createAt).toLocaleString(
                        "Vi-VN"
                      )}
                      id={notification._id}
                      type={notification.isRead}
                      user={notification.otherUser?.avatar ?? ""}
                    />
                  ))
              ) : (
                <p className="text-muted-foreground text-sm">
                  Không có thông báo nào chưa đọc.
                </p>
              )}
            </ScrollArea>
          </TabsContent>
          <Separator />
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};

export default UserNoti;
