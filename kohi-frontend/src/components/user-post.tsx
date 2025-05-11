import { ImageViewerContext } from "@/context/image-viewer-context";
import { UserContext } from "@/context/user-context";
import { cn } from "@/lib/utils";
import { getChannelList } from "@/repository/chat-repository";
import {
  createSharePost,
  likePost,
  unLikePost
} from "@/repository/PostsRepository";
import {
  addBookMark,
  followUser,
  getProfile,
  unBookMark,
  unFollowUser,
} from "@/repository/user-repository";
import { Post } from "@/types/post-type";
import { User } from "@/types/user-type";
import {
  Bookmark,
  MessagesSquare,
  Repeat,
  Send,
  ThumbsUp,
  UserRoundPlus
} from "lucide-react";
import { DateTime } from "luxon";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import CommentUI from "./comment";
import { ReportPostDialog } from "./reportDialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Textarea } from "./ui/textarea";
import { UserPostOption } from "./user-post-option";
import UserPostShareQuote from "./user-post-share-Quote";

function UserHoverCard({
  children,
  user,
  className,
  onFollowChange,
}: {
  children?: React.ReactNode;
  user: User;
  className?: string;
  onFollowChange?: () => void;
}) {
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const { user: currentUser, setUser } = useContext(UserContext);
  const [isCreateDMOpen, setIsCreateDMOpen] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (currentUser && currentUser.following?.includes(user._id)) {
      setIsFollowing(true);
    } else {
      setIsFollowing(false);
    }
  }, [currentUser, user._id]);

  const handleFollow = async () => {
    await followUser(user._id)
      .then((res) => {
        if (res && res.statusCode === 401) {
          return navigate("/login");
        }
        if (res && res.statusCode === 400) {
          return console.log(res.message);
        } else {
          setIsFollowing(true);
          setUser((prevUser) => {
            if (!prevUser) return prevUser;
            return {
              ...prevUser,
              following: [...(prevUser.following || []), user._id],
            };
          });
        }
        onFollowChange?.();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleUnfollow = async () => {
    await unFollowUser(user._id)
      .then((res) => {
        if (res && res.statusCode === 401) {
          return navigate("/login");
        } else {
          setIsFollowing(false);
          setUser((prevUser) => {
            if (!prevUser) return prevUser;
            return {
              ...prevUser,
              following:
                prevUser.following?.filter((id) => id !== user._id) || [],
            };
          });
        }
        onFollowChange?.();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  function messageBtnHandler() {
    getChannelList([user._id]).then((channels) => {
      if (channels.length > 0) {
        navigate(`/message/${channels[0]._id}`);
      } else {
      }
    });
  }

  return (
    <>
      <Dialog
        open={isCreateDMOpen}
        onOpenChange={() => setIsCreateDMOpen(false)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start a DM</DialogTitle>
            <DialogDescription>
              You and this user will be able to chat privately.
            </DialogDescription>
          </DialogHeader>
          <Label htmlFor="message">Message</Label>
          <Textarea />
          <DialogFooter>
            <Button variant="secondary">Cancel</Button>
            <Button>Send</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <HoverCard>
        <HoverCardTrigger className={className}>{children}</HoverCardTrigger>
        <HoverCardContent className="w-80 max-w-full">
          <div className="space-y-4">
            <div className="flex gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage
                  src={user.avatar ?? user.displayName}
                  className="rounded-full"
                  alt={user.username}
                />
                <AvatarFallback>{user.username[0]}</AvatarFallback>
              </Avatar>
              <Link to={`/profile/${user._id}`} className="flex-grow">
                <div>
                  <div>
                    <span className="font-bold">
                      {user.displayName ?? user.username}
                    </span>
                    <span className="pl-2 text-muted-foreground text-sm">
                      @{user.username}
                    </span>
                  </div>
                  <div className="text-sm">
                    {user.bio ?? "Một người dùng Ko-Hi"}
                  </div>
                </div>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {isFollowing ? (
                <Button onClick={handleUnfollow}>
                  <UserRoundPlus className="w-4 h-4 mr-2" />
                  UnFriend
                </Button>
              ) : (
                <Button onClick={handleFollow}>
                  <UserRoundPlus className="w-4 h-4 mr-2" />
                  Add Friend
                </Button>
              )}
              <Button variant="secondary" onClick={messageBtnHandler}>
                <MessagesSquare className="w-4 h-4 mr-2" />
                Message
              </Button>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </>
  );
}
export default function UserPost({
  post,
  onBookmarkUpdate,
  onDelete,
  onRepost,
  onShareQuote,
  onUpdateShare,
  onEditPost,
  onFollowChange,
  onUpdateLike,
  onCommentCreate,
  hideComment,
  showEditPost,
  className,
  lineClampNumber,
}: {
  post: Post;
  hideComment?: boolean;
  onDelete?: () => void;
  onRepost?: () => void;
  onShareQuote?: () => void;
  onUpdateShare?: () => void;
  onEditPost?: () => void;
  onFollowChange?: () => void;
  onUpdateLike?: () => void;
  onCommentCreate?: () => void;
  showEditPost?: boolean;
  onBookmarkUpdate?: (newStatus: boolean) => void;
  lineClampNumber?: number;
  className?: string;
}) {
  const { user, setUser, setLoginFormOpen } = useContext(UserContext);
  const {openImage} = useContext(ImageViewerContext);
  const [isLiked, setIsLiked] = useState(
    post.likes?.includes(user ? user._id : "") ?? 0
  );
  const [isBookMarked, setIsBookMarked] = useState(false);
  const [isQuoteDialogOpen, setIsQuoteDialogOpen] = useState(false);
  const handleOpenQuoteDialog = () => {
    setIsQuoteDialogOpen(true);
  };
  const handleCloseQuoteDialog = () => {
    setIsQuoteDialogOpen(false);
  };

  const handleLike = async () => {
    if (!user) {
      toast.error("Please login to post");
      setLoginFormOpen(true);
      return;
    }
    await likePost(post._id)
      .then(() => {
        onUpdateLike?.();
        setIsLiked(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleUnlike = () => {
    if (!user) {
      toast.error("Please login to post");
      setLoginFormOpen(true);
      return;
    }
    unLikePost(post._id)
      .then(() => {
        onUpdateLike?.();
        setIsLiked(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (user?.bookmarks?.includes(post._id)) {
      setIsBookMarked(true);
    }
  }, [user, post._id]);
  const handleAddBookmark = async () => {
    try {
      if (!user) {
        toast.error("Please login to post");
        setLoginFormOpen(true);
        return;
      }
      await addBookMark(post._id).then(() => {
        setIsBookMarked(true);
        getProfile().then(setUser);
        if (onBookmarkUpdate) {
          onBookmarkUpdate(true);
        }
      });
    } catch (err) {
      console.log(err);
    }
  };
  const handleRemoveBookmark = async () => {
    try {
      if (!user) {
        toast.error("Please login to post");
        setLoginFormOpen(true);
        return;
      }
      await unBookMark(post._id).then(() => {
        setIsBookMarked(false);
        getProfile().then(setUser);
        if (onBookmarkUpdate) {
          onBookmarkUpdate(false);
        }
      });
    } catch (err) {
      console.log(err);
    }
  };
  const handleClickRepost = async () => {
    if (!user) {
      toast.error("Please login to post");
      setLoginFormOpen(true);
      return;
    }
    await createSharePost(post._id)
      .then(() => {
        onRepost?.();
        getProfile().then(setUser);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // const handleReportPost = async () => {
  //   await reportPost(post._id)
  // }

  const handleEditPost = () => {
    onEditPost?.();
  };
  return (
    <Card className={cn("max-sm:rounded-none", className)}>
      <div className="flex px-6 pt-4 flex-row items-center">
        {user?._id !== post.author._id ? (
          <UserHoverCard
            user={post.author}
            className="self-stretch grid place-items-center pr-4"
            onFollowChange={onFollowChange}
          >
            <Avatar className="w-8 h-8">
              <AvatarImage
                src={post.author.avatar ?? ""}
                className="rounded-full"
                alt={post.author.displayName}
              />
              <AvatarFallback>
                {post.author.displayName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </UserHoverCard>
        ) : (
          <div className="self-stretch grid place-items-center pr-4">
            <Avatar className="w-8 h-8">
              <AvatarImage
                src={post.author.avatar ?? ""}
                className="rounded-full"
                alt={post.author.displayName}
              />
              <AvatarFallback>
                {post.author.displayName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>
        )}
        <div className="">
          {user?._id !== post.author._id ? (
            <UserHoverCard user={post.author}>
              <div className="font-bold">
                {post.author.displayName ?? post.author.username}
              </div>
            </UserHoverCard>
          ) : (
            <div className="font-bold">
              {post.author.displayName ?? post.author.username}
            </div>
          )}
          <div className="text-muted-foreground text-sm">
            {user?._id !== post.author._id ? (
              <UserHoverCard user={post.author}>
                @{post.author.username}
              </UserHoverCard>
            ) : (
              <span>@{post.author.username}</span>
            )}
            <Link to={`/post/detail/${post._id}`}>
              {/* {" "}- {new Date(post.createdAt).toLocaleString("vi-VN")} */}{" "}
              - {DateTime.fromISO(post.createdAt.toString()).toRelative()}
            </Link>
          </div>
        </div>
        <Link
          to={`/post/detail/${post._id}`}
          className="block flex-grow self-stretch"
        />
        {showEditPost && (
          <UserPostOption
            post={post}
            onDelete={onDelete}
            onUpdateShare={onUpdateShare}
            onEditPost={handleEditPost}
          />
        )}
        {!showEditPost && <ReportPostDialog postId={post._id} />}
      </div>
      <Link to={`/post/detail/${post._id}`} className="block px-6 py-4">
        <p className="hyphens-auto" style={{
          "lineClamp": lineClampNumber,
          "display": "-webkit-box",
          "overflow": "hidden",
          "WebkitLineClamp": lineClampNumber,
          "WebkitBoxOrient": "vertical",
          "overflowWrap": "anywhere"
        }}>
          {post.content?.split("\n").map((v, i, arr) => {
            return (
              <span key={i}>
                {v}
                {i < arr.length - 1 && <br />}
              </span>
            );
          })}
        </p>
      </Link>
      {post.postShare && (
        <UserPost post={post.postShare} className="mx-4 mb-4" hideComment />
      )}
      {post.media && post.media.length > 0 && (
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full max-w-2xl pb-4"
        >
          <CarouselContent className="px-8 mr-4">
            {post.media?.map((media, index) => (
              <CarouselItem key={index} className="basis-1/3">
                <div className="p-1">
                  <Card>
                    <CardContent className="aspect-square p-0" onClick={() => openImage(media)}>
                      <img
                        key={index}
                        src={media}
                        alt="cat"
                        className="object-cover w-full h-full rounded-lg"
                      />
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-8 disabled:opacity-5" />
          <CarouselNext className="right-8 disabled:opacity-5" />
        </Carousel>
      )}
      {!hideComment && (
        <>
          <Separator />
          <div className="flex justify-between gap-2 px-4 py-2">
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center justify-center gap-2"
                onClick={isLiked ? handleUnlike : handleLike}
              >
                <ThumbsUp
                  className={cn("w-4 h-4", isLiked ? "fill-primary" : "")}
                />
                {post.likes?.length || ""}
              </Button>
              <div>
                <CommentUI postId={post._id} post={post} onCreatedComment={onCommentCreate} />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center justify-center gap-2"
                  >
                    <Repeat className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={handleClickRepost}>
                    Repost
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleOpenQuoteDialog}>
                    Quote
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center justify-center gap-2"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Send via message to...</DropdownMenuItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>Share to...</DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem>Facebook</DropdownMenuItem>
                        <DropdownMenuItem>Twitter</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Copy link</DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center justify-center gap-2"
                onClick={
                  isBookMarked ? handleRemoveBookmark : handleAddBookmark
                }
              >
                <Bookmark
                  className={cn("w-4 h-4", isBookMarked ? "fill-primary" : "")}
                />
              </Button>
              <UserPostShareQuote
                isOpen={isQuoteDialogOpen}
                onClose={handleCloseQuoteDialog}
                onShareQuote={onShareQuote}
                post={post}
              />
            </div>
          </div>
        </>
      )}
    </Card>
  );
}
