import {
  Bookmark,
  MessageCircle,
  MessagesSquare,
  Repeat,
  Send,
  ThumbsUp,
  UserRoundPlus,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
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
import { Separator } from "./ui/separator";
import { Post } from "@/types/post-type";
import { User } from "@/types/user-type";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { useContext, useEffect, useState } from "react";
import {
  addBookMark,
  followUser,
  getProfile,
  unBookMark,
  unFollowUser,
} from "@/repository/user-repository";
import { likePost, unLikePost } from "@/repository/PostsRepository";
import { cn } from "@/lib/utils";
import { UserContext } from "@/context/user-context";

function UserHoverCard({
  children,
  user,
}: {
  children?: React.ReactNode;
  user: User;
}) {
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const handleFollow = async () => {
    try {
      await followUser(user._id);
      setIsFollowing(true);
    } catch (err) {
      console.log(err);
    }
  };
  const handleUnfollow = async () => {
    try {
      console.log("Unfollow");
      await unFollowUser(user._id);
      setIsFollowing(false);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <HoverCard>
      <HoverCardTrigger>{children}</HoverCardTrigger>
      <HoverCardContent className="w-80 max-w-full">
        <div className="space-y-4">
          <div className="flex gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage
                src={user.avatar}
                className="rounded-full"
                alt={user.username}
              />
              <AvatarFallback>{user.username[0]}</AvatarFallback>
            </Avatar>
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
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Button onClick={isFollowing ? handleUnfollow : handleFollow}>
              <UserRoundPlus className="w-4 h-4 mr-2" />
              {isFollowing ? "UnFriend" : "Add Friend"}
            </Button>
            <Button variant="secondary">
              <MessagesSquare className="w-4 h-4 mr-2" />
              Message
            </Button>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

export default function UserPost({
  post,
  onBookmarkUpdate,
}: {
  post: Post;
  onBookmarkUpdate?: (newStatus: boolean) => void;
}) {
  const { user, setUser } = useContext(UserContext);
  const [isLiked, setIsLiked] = useState(
    post.likes?.includes(user ? user._id : "") ?? 0
  );
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);
  const [isBookMarked, setIsBookMarked] = useState(false);
  const handleLike = async () => {
    try {
      await likePost(post._id);
      setIsLiked(true);
      setLikeCount(likeCount + 1);
    } catch (err) {
      console.log(err);
    }
  };
  const handleUnlike = async () => {
    try {
      await unLikePost(post._id);
      setIsLiked(false);
      setLikeCount(likeCount - 1);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (user?.bookmarks?.includes(post._id)) {
      setIsBookMarked(true);
    }
  }, [user, post._id]);
  const handleAddBookmark = async () => {
    try {
      await addBookMark(post._id);
      setIsBookMarked(true);
      getProfile().then(setUser);
      if (onBookmarkUpdate) {
        onBookmarkUpdate(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleRemoveBookmark = async () => {
    try {
      await unBookMark(post._id);
      setIsBookMarked(false);
      getProfile().then(setUser);
      if (onBookmarkUpdate) {
        onBookmarkUpdate(false);
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <Card className="max-sm:rounded-none">
      <div className="flex px-6 py-4 flex-row gap-4 items-center">
        <UserHoverCard user={post.author}>
          <Avatar className="w-8 h-8">
            <AvatarImage
              src={post.author.avatar}
              className="rounded-full"
              alt="@shadcn"
            />
            <AvatarFallback>{post.author.username[0]}</AvatarFallback>
          </Avatar>
        </UserHoverCard>
        <div>
          <UserHoverCard user={post.author}>
            <div className="font-bold">
              {post.author.displayName ?? post.author.username}
            </div>
          </UserHoverCard>
          <div className="text-muted-foreground text-sm">
            <UserHoverCard user={post.author}>
              @{post.author.username}
            </UserHoverCard>{" "}
            - {post.createdAt.toLocaleString()}
          </div>
        </div>
      </div>
      <div className="px-6 mb-4">
        <p>{post.content.split("\n").filter(v=>v).map((v)=>{
          return <span>{v}<br/></span>
        })}</p>
      </div>
      {/* <img src="https://cataas.com/cat" alt="cat" className="mt-4 mx-auto max-w-xl max-h-[36rem] object-contain"/> */}
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
            {likeCount}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center justify-center gap-2"
          >
            <MessageCircle className="h-4 w-4" />
          </Button>
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
              <DropdownMenuItem>Repost</DropdownMenuItem>
              <DropdownMenuItem>Quote...</DropdownMenuItem>
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
            onClick={isBookMarked ? handleRemoveBookmark : handleAddBookmark}
          >
            <Bookmark
              className={cn("w-4 h-4", isBookMarked ? "fill-primary" : "")}
            />
          </Button>
        </div>
      </div>
    </Card>
  );
}
