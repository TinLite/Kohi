import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ChatContext } from "@/context/chat-context";
import { UserContext } from "@/context/user-context";
import { cn } from "@/lib/utils";
import { ChatChannel, ChatChannelType } from "@/types/chat-types";
import { PenLine } from "lucide-react";
import { DateTime } from "luxon";
import { useContext, useMemo } from "react";
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

function MessageSelectionItem({
  chatChannel,
  selected = false,
  onSelect,
}: {
  chatChannel: ChatChannel;
  selected?: boolean;
  onSelect?: () => void;
}) {
  const { user } = useContext(UserContext);
  let avatar = "https://i.pravatar.cc/300";
  let channelName = useMemo(() => {
    if (chatChannel.name) {
      return chatChannel.name;
    }
    let result = ""
    if (chatChannel.type === ChatChannelType.PRIVATE) {
      if (chatChannel.participants.length > 2) {
        result = chatChannel.participants
          .filter((p) => p.user._id !== user?._id)
          .slice(0, 2)
          .map((p) => '@' + p.user.username)
          .join(", ");
        if (chatChannel.participants.length > 3) {
          result += ` and ${chatChannel.participants.length - 3} other(s)`;
        }
        return result;
      }

      const targetUser = chatChannel.participants.find(
        (p) => p.user._id !== user?._id
      )?.user;

      if (targetUser) {
        avatar = targetUser.avatar ?? avatar;
        result = chatChannel.name ?? targetUser.displayName ?? `@${targetUser.username}`;
      }
      return result;
    }
  }, [chatChannel, user?._id]);

  const latestMessage = chatChannel.latestMessage;

  const text = useMemo(() => {
    var result = latestMessage?.content;
    if (!result) {
      if (latestMessage?.isRecalled) {
        result = "Tin nhắn đã bị thu hồi";
        return
      }
      if (latestMessage?.files?.length) {
        result = `Đã gửi ${latestMessage.files.length} tệp tin`;
      }
    }
    return result;
  }, [latestMessage]);

  return (
    <button
      className={cn([
        "w-full flex gap-4 px-4 py-2 mb-2 rounded-md border",
        "hover:bg-accent",
        selected ? "bg-muted" : "",
      ])}
      onClick={onSelect}
    >
      <Avatar>
        <AvatarImage src={avatar} className="rounded-full" alt="User" />
        <AvatarFallback>U</AvatarFallback>
      </Avatar>
      <div className="flex-grow text-left text-sm">
        <div className="flex justify-between">
          <span className="font-bold">{channelName}</span>
          <span className="pl-2 text-muted-foreground text-sm">
            {
              // @ts-expect-error
              DateTime.fromISO(chatChannel.latestMessage?.timeStamp).toRelative()
            }
          </span>
        </div>
        <div className="text-muted-foreground">
          {
            text
              ? text.length > 30
                ? text.substring(0, 30) + "..."
                : text
              : "Chưa có tin nhắn nào"
          }
        </div>
      </div>
    </button>
  );
}

export default function MessageLayout() {
  const { channelID } = useParams();

  const { chatChannelList: channels } = useContext(ChatContext);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex flex-grow h-screen">
      <div
        className={cn(
          "bg-background flex flex-col h-screen w-96 max-w-[100vw] max-md:flex-grow",
          (channelID || location.pathname == "/message/new") ? "max-md:hidden" : ""
        )}
      >
        <div className="w-full px-4 flex items-center">
          <h1 className="text-xl font-bold py-2">Tin nhắn</h1>
          <Link
            to="/message/new"
            className={buttonVariants({
              size: "icon",
              variant: "ghost",
              className: "ml-auto",
            })}
          >
            <PenLine />
          </Link>
        </div>
        <Separator />
        <ScrollArea className="flex-grow flex flex-col items-stretch p-4 max-md:pb-16">
          {channels.map((channel) => (
            <MessageSelectionItem
              key={channel._id}
              chatChannel={channel}
              selected={channelID === channel._id}
              onSelect={() => navigate(`/message/${channel._id}`)}
            />
          ))}
        </ScrollArea>
      </div>
      <Separator orientation="vertical" className="max-md:hidden" />
      <Outlet />
    </div>
  );
}
