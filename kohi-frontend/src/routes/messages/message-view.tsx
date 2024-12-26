import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { ChatContext } from "@/context/chat-context";
import { UserContext } from "@/context/user-context";
import { cn } from "@/lib/utils";
import { getChannelMessages, recallMesssage, sendMessage, updateChannel } from "@/repository/chat-repository";
import socket from "@/services/socket";
import { ChatChannelType, ChatMessage } from "@/types/chat-types";
import { SocketEvent } from "@/types/socket-types";
import { User } from "@/types/user-type";
import { ChevronLeft, CircleX, DoorOpen, Ellipsis, ImagePlus, ImageUp, PanelRightOpen, PenLine, ReplyIcon, Trash2, UserPlus } from "lucide-react";
import { DateTime } from "luxon";
import { useContext, useEffect, useReducer, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

function UserMessage({ className, isMe, name, avatar, image, noPaddingTop, message, onReply, isReplyingTo = false, replyTarget, isRecalled, onRecall = () => { } }: { className?: string, isMe?: boolean, name?: string, avatar?: string, image?: string, noPaddingTop?: boolean, message?: string, onReply?: () => void, isReplyingTo?: boolean, replyTarget?: ChatMessage, isRecalled?: boolean, onRecall?: () => void }) {
  return (
    <div
      className={cn([
        "flex gap-2 px-4 group hover:bg-primary/5 transition-all bg-inherit",
        (isMe ? "flex-row-reverse" : ""),
        (noPaddingTop ? "mt-1" : "mt-4"),
        (isReplyingTo ? "bg-primary/5 border-l-8 border-primary" : ""),
        className
      ])}>
      {!isMe &&
        <div className="w-10 flex items-end">
          {avatar &&
            <Avatar className="w-10 h-10 shadow">
              <AvatarImage src={avatar} className="rounded-full" alt="User" />
              <AvatarFallback>{name?.charAt(0) ?? '@'}</AvatarFallback>
            </Avatar>
          }
        </div>
      }
      <div className="max-w-xl">
        {
          replyTarget &&
          <div className={cn(`rounded-md mb-2`, (isMe ? "ml-12" : "ml-4"))}>
            <div className="text-muted-foreground text-sm">
              <span className="italic">Reply to </span>
              {
                replyTarget.isRecalled ?
                  <span className="italic">a removed message</span> :
                  replyTarget.content
              }
            </div>
          </div>
        }
        {
          name &&
          <div className={cn(
            "text-muted-foreground text-sm px-4",
            (isMe ? "text-right" : "text-left")
          )}>{name}</div>
        }
        <ContextMenu>
          <ContextMenuTrigger>
            <div className=
              {cn("flex gap-2 select-none",
                (isMe ? "flex-row-reverse" : ""))
              }>
              <div className={cn(
                "rounded-md shadow",
                (isMe ? "bg-primary/10 border border-primary/20" : "bg-background")
              )}>
                <div className="px-4 py-2">
                  {
                    isRecalled ?
                      <p className="italic text-muted-foreground">This message was recalled</p> :
                      message?.split('\n').map((line, index) => (
                        <p key={index}>{line}</p>
                      ))
                  }
                </div>
                {
                  image &&
                  <div className="flex justify-center max-h-96 rounded-b-md bg-black">
                    <img src={image} alt="Shared" className="object-contain rounded-b-md" />
                  </div>
                }
              </div>
              <div className="gap-2 opacity-0 group-hover:opacity-100">
                {
                  onReply &&
                  <Button size="icon" variant="ghost" onClick={onReply}>
                    <ReplyIcon className="opacity-50" />
                  </Button>
                }
              </div>
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent >
            <ContextMenuItem disabled={isRecalled} onClick={() => onReply && onReply()}>Reply</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem disabled={isRecalled} onClick={() => navigator.clipboard.writeText(message ?? "").then(() => toast.success("Copied message to clipboard"))}>Copy</ContextMenuItem>
            <ContextMenuItem disabled={isRecalled} onClick={() => onRecall && onRecall()}>Recall</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </div>
    </div>
  )
}

function DialogEditChannelAvatar({ open, onOpenChange, onSubmit }: { open: boolean, onOpenChange: () => void, onSubmit?: (file?: File) => void }) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const ref = useRef<HTMLInputElement>(null);
  function submitBtnHandler() {
    onSubmit?.(selectedFile!);
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update new cover for this chat channel</DialogTitle>
          <DialogDescription>This will also be changed for everyone else in the chat.</DialogDescription>
        </DialogHeader>
        <img src={
          selectedFile ?
            URL.createObjectURL(selectedFile) :
            "https://picsum.photos/144"
        } className="aspect-square object-cover rounded-full w-screen max-w-36 mx-auto" />
        <Input className="cursor-pointer" type="file" ref={ref} accept="image/*" onChange={(e) => {
          const file = e.currentTarget.files?.item(0);
          if (file) {
            setSelectedFile(file);
          }
        }} />
        <DialogFooter>
          <Button variant="outline" type="reset" onClick={(e) => {
            e.preventDefault();
            setSelectedFile(null);
            ref.current!.value = "";
            onOpenChange();
          }}>Discard</Button>
          <Button disabled={(selectedFile == null)} onClick={submitBtnHandler}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function DialogEditChannelName({ open, onOpenChange }: { open: boolean, onOpenChange: () => void }) {
  const { chatChannel: channel, refreshChannel } = useContext(ChatContext);
  const [channelName, setChannelName] = useState(channel?.name ?? "");
  function submitHandler() {
    if (!channel || !channelName) {
      return;
    }
    updateChannel(channel?._id, { name: channelName }).then(() => {
      toast.success("Channel name updated successfully");
      refreshChannel();
      onOpenChange();
    });
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change this channel's name</DialogTitle>
          <DialogDescription>Change display name of this channel.<br />The name will also be changed for everyone else in the chat.</DialogDescription>
        </DialogHeader>
        <div className="grid">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="chat-channel-name-new-edit" className="text-right">Channel name</Label>
            <Input
              className="col-span-3"
              id="chat-channel-name-new-edit"
              onChange={(e) => setChannelName(e.currentTarget.value)}
              value={channelName}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" type="reset" onClick={(e) => {
            e.preventDefault();
            setChannelName(channel?.name ?? "");
            onOpenChange();
          }}>Discard</Button>
          <Button disabled={channelName?.trim().length == 0} onClick={submitHandler}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function SheetChannelSettings({ open, onOpenChange }: { open: boolean, onOpenChange: () => void }) {
  const { chatChannel: channel } = useContext(ChatContext);
  const [editChannelNameOpen, setEditChannelNameOpen] = useState(false);
  const [editChannelAvatarOpen, setEditChannelAvatarOpen] = useState(false);
  function onAvatarUpdateSubmit(file?: File) {
    if (!file || !channel) {
      return;
    }
    updateChannel(channel?._id, { avatar: file }).then(() => {
      toast.success("Channel avatar updated successfully");
      onOpenChange();
    });
  }
  return (
    <>
      <DialogEditChannelName open={editChannelNameOpen} onOpenChange={() => setEditChannelNameOpen(false)} />
      <DialogEditChannelAvatar open={editChannelAvatarOpen} onOpenChange={() => setEditChannelAvatarOpen(false)} onSubmit={onAvatarUpdateSubmit} />
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full">
          <SheetHeader className="mb-4">
            <SheetTitle>{channel?.name ?? "Unnamed chat"}</SheetTitle>
            <SheetDescription>Chat channel setting</SheetDescription>
          </SheetHeader>
          <div className="flex gap-2 flex-col">
            <Accordion type="single" collapsible className="w-full text-left">
              <AccordionItem value="item-chat-setting">
                <AccordionTrigger>General chat setting</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-2 align-middle">
                  <Button variant="outline" className="justify-start gap-3" onClick={() => setEditChannelNameOpen(true)}><PenLine className="w-5 h-5" strokeWidth={2} /> Change chat name</Button>
                  <Button variant="outline" className="justify-start gap-3" onClick={() => setEditChannelAvatarOpen(true)} disabled><ImageUp className="w-5 h-5" strokeWidth={2} /> Change cover</Button>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-chat-participants">
                <AccordionTrigger>Participants</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-2 align-middle">
                  <Button variant="outline" disabled>
                    <UserPlus className="mr-2" />
                    Add user to chat
                  </Button>
                  {
                    channel?.participants.map((participant) => (
                      <div className="flex items-center gap-2" key={participant.user._id}>
                        <Avatar>
                          <AvatarImage src={participant.user.avatar} />
                          <AvatarFallback>@</AvatarFallback>
                        </Avatar>
                        <div>
                          <h1 className="font-bold">{participant.user.displayName ?? participant.user.username}</h1>
                          <h4 className="text-xs text-muted-foreground">Joined on {DateTime.fromISO(participant.joinedAt.toString()).toLocaleString()}</h4>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="ml-auto"><Ellipsis /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent side="left">
                            <DropdownMenuItem disabled><span className="text-destructive hover:text-destructive">Remove participant</span></DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ))
                  }
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-chat-destructive-opntions">
                <AccordionTrigger>Destructive options</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-2 align-middle">
                  <Button variant="destructive" className="justify-start gap-3 w-full" disabled><DoorOpen className="w-5 h-5" strokeWidth={2} /> Leave chat</Button>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}

function MessageView({ className }: { className?: string }) {

  const { chatChannel: channel } = useContext(ChatContext);

  const [reducedMessage, setReducedMessage] = useReducer((state: ChatMessage[], action: {
    type: 'append' | 'prepend' | 'replace' | 'replace_one',
    payload: ChatMessage[]
  }) => {
    console.log("REDUCER", action);
    switch (action.type) {
      case 'append':
        return [...state, ...action.payload];
      case 'prepend':
        return [...action.payload, ...state];
      case 'replace':
        return action.payload;
      case 'replace_one':
        const target = action.payload[0];
        const newMap = state.map((message) => {
          if (message._id === target._id) {
            return target;
          }
          if (message.replyTo?._id === target._id) {
            return { ...message, replyTo: target };
          }
          return message;
        })
        return newMap;
    }
  }, []);
  const [channelSettingStatus, setChannelSettingStatus] = useState(false);

  const [channelName, setChannelName] = useState<string | undefined>(channel?.name ?? "Chat channel");
  const [targetUser, setTargetUser] = useState<User | undefined>(undefined);
  const [avatar, setAvatar] = useState<string | undefined>(undefined);
  const { user } = useContext(UserContext);
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);

  const [replyTarget, setReplyTarget] = useState<ChatMessage | null>(null);

  const [isScrolling, setIsScrolling] = useState(false);

  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  function scrollToBottom() {
    const target = scrollAreaRef.current?.querySelector(
      ".h-full.w-full.rounded-\\[inherit\\]"
    );
    target?.scrollTo({ top: target?.scrollHeight, behavior: "smooth" });
  }

  useEffect(() => {
    if (channel)
      getChannelMessages(channel._id).then((messages) => { setReducedMessage({ type: 'replace', payload: messages.reverse() }) });
  }, [channel?._id])

  // Update channel name
  useEffect(() => {
    if (channel?.type === ChatChannelType.PRIVATE) {
      const targetUser = channel.participants.find(p => p.user._id !== user?._id)?.user;
      if (targetUser) {
        setChannelName(targetUser.displayName ?? `@${targetUser.username}`);
        setAvatar(targetUser.avatar);
      }
      setTargetUser(targetUser);
    } else {
      setChannelName(channel?.participants.map(p => p.user.displayName ?? `@${p.user.username}`).join(', ') ?? channel?._id);
    }
  }, [])

  useEffect(() => {
    if (!user) {
      return;
    }
    socket.on(SocketEvent.CHAT_MESSAGE_NEW, (newMessage: ChatMessage) => {
      if (newMessage.channelID === channel?._id) {
        setReducedMessage({ type: 'append', payload: [newMessage] });
      }
    });
    socket.on(SocketEvent.CHAT_MESSAGE_UPDATE, (newMessage: ChatMessage) => {
      if (newMessage.channelID === channel?._id) {
        setReducedMessage({ type: 'replace_one', payload: [newMessage] });
      }
    });
    return () => {
      socket.off(SocketEvent.CHAT_MESSAGE_NEW);
      socket.off(SocketEvent.CHAT_MESSAGE_UPDATE);
    }
  }, [channel?._id, user?._id])

  useEffect(() => {
    if (isScrolling) {
      return;
    }
    scrollToBottom();
  }, [reducedMessage]);

  const onSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!channel)
      return;
    const form = e.currentTarget as HTMLFormElement;
    // https://stackoverflow.com/a/36249012
    const input = Array.from(form.querySelectorAll('input')).find(i => i.name === 'content') as HTMLInputElement;
    const message = input.value.trim();
    if (!message)
      return;
    input.value = '';
    setReplyTarget(null);
    const data: {
      content: string;
      replyTo?: string;
    } = {
      content: message,
    }
    if (replyTarget) {
      data["replyTo"] = replyTarget._id;
    }
    sendMessage(channel._id, data);
  }

  const onMessageScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const newScrollState =
      target.scrollTop + target.clientHeight < target.scrollHeight - 10;
    if (newScrollState !== isScrolling) {
      setIsScrolling(newScrollState);
    }
  };

  const openFileUploadSelector = () => {
    document.getElementById("form-inp-upload-file")?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files!;
    const arrayFiles = [];
    // Kiem tra xem neu file khong phai anh thi return
    for (var i = 0; i < files.length; i++) {
      const singleFile = files.item(i);
      if (!singleFile?.type.startsWith("image/")) {
        e.preventDefault();
        return;
      }
      arrayFiles.push(singleFile)
    }
    setSelectedImages(arrayFiles);
  }

  const recallHandler = async (message: ChatMessage) => {
    recallMesssage(channel?._id ?? "", message._id).then(() => {
      toast.success("Message recalled successfully");
    });
  }

  return (
    <div className={cn(className, "flex-grow flex h-screen flex-col")}>
      <SheetChannelSettings onOpenChange={() => setChannelSettingStatus(false)} open={channelSettingStatus} />
      <div className="md:px-4 py-0.5 bg-background flex items-center">
        <Link to="/message" className={buttonVariants({
          variant: "ghost",
          size: "icon"
        })}>
          <ChevronLeft />
        </Link>
        <Avatar className="w-8 h-8 shadow mr-4">
          <AvatarImage src={avatar} className="rounded-full" alt="User" />
          <AvatarFallback>{channelName?.charAt(0) ?? '-'}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="font-bold">{channelName ?? ""} <span className="font-normal text-muted-foreground">@{targetUser?.username}</span></h1>
          <h4 className="text-xs">Online</h4>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setChannelSettingStatus(true)} className="ml-auto">
          <PanelRightOpen strokeWidth={1.5} />
        </Button>
      </div>
      <Separator />
      <ScrollArea ref={scrollAreaRef} onScroll={onMessageScroll} className="flex-grow flex flex-col-reverse">
        {
          reducedMessage.map((message) => {
            const isMe = message.senderID._id === user?._id;
            return (
              <UserMessage
                className="last:pb-4"
                isReplyingTo={replyTarget?._id === message._id}
                replyTarget={message.replyTo}
                onReply={() => {
                  if (replyTarget?._id !== message._id) {
                    setReplyTarget(message);
                  }
                }}
                key={message._id}
                isMe={isMe}
                name={isMe ? undefined : message.senderID.displayName ?? message.senderID.username}
                avatar={isMe ? undefined : message.senderID.avatar}
                message={message.content}
                isRecalled={message.isRecalled}
                onRecall={() => recallHandler(message)}
              />
            )
          })
        }
        {replyTarget &&
          <div className="py-6"></div>
        }
      </ScrollArea>

      {selectedImages && (
        <>
          <Separator />
          <ScrollArea className="shrink-0">
            <div className="flex gap-4 px-2">
              {selectedImages.map((v, i) => {
                // TODO: Add removing image
                return (
                  <div className="aspect-square w-24 h-24 grid place-items-center relative p-2" key={v.name}>
                    <Button
                      variant="outline"
                      size="icon"
                      className="w-6 h-6 absolute top-0 -right-2"
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedImages(selectedImages.filter((_, index) => index !== i));
                      }}
                    >
                      <Trash2 />
                    </Button>
                    <img
                      src={URL.createObjectURL(v)}
                      alt=""
                      key={i}
                      className=""
                    />
                  </div>
                );
              })}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </>
      )}

      <div className="sticky bottom-0">
        <div className={cn("absolute w-full -translate-y-full bg-muted border-t border-l border-r -ml-[1px] -mr-[1px] rounded-t-md -z-10 animate-in fade-in slide-in-from-bottom-8 items-center",
          replyTarget ? "flex" : "hidden"
        )}>
          <h1 className="text-sm px-4 py-1">Replying to
            {
              replyTarget?.senderID._id === user?._id ?
                <span> yourself</span> :
                <span className="font-bold"> {replyTarget?.senderID.displayName ?? replyTarget?.senderID.username}</span>
            }
          </h1>
          <Button variant="ghost" size="icon" onClick={(e) => e.preventDefault()} className="text-muted-foreground hover:text-foreground ml-auto">
            <CircleX className="w-4 h-4 aspect-square" onClick={() => setReplyTarget(null)} />
          </Button>
        </div>
        <Separator />
        <div className="bg-background flex gap-2 px-4 py-2">
          <Button variant="ghost" size="icon" disabled onClick={(e) => {
            e.preventDefault();
            openFileUploadSelector();
          }}>
            <ImagePlus />
          </Button>
          <form onSubmit={onSendMessage} className="flex-grow flex gap-2">
            <input type="file" name="images" className="hidden" id="form-inp-upload-file" onChange={handleFileChange} accept="image/*" multiple />
            <Input placeholder="Nhập tin nhắn..." className="flex-grow" name="content" />
            <Button>Gửi</Button>
          </form>
        </div>
      </div>
    </div >
  )
}

export function PageMessageChannel() {
  const { chatChannel } = useContext(ChatContext);

  useEffect(() => {

  }, [chatChannel])

  if (!chatChannel) {
    return (
      <div className="flex-grow flex flex-col">
        <div className="flex items-center px-4 py-1 bg-white gap-2">
          <Link to="/message" className={buttonVariants({
            variant: "ghost",
            size: "icon"
          })}>
            <ChevronLeft />
          </Link>
          <Skeleton className="w-7 aspect-square rounded-full" />
          <div className="flex-grow grid gap-2">
            <Skeleton className="rounded-full h-4" />
          </div>

        </div>
        <Separator />
        <div className="flex-grow"></div>
      </div>
    )
  } else
    return (
      <MessageView />
    )
}