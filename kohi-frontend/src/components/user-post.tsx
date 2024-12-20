import { UserContext } from "@/context/user-context";
import { cn } from "@/lib/utils";
import {
  countLikePost,
  likePost,
  unLikePost,
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
  UserRoundPlus,
} from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import CommentUI from "./comment";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
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
import { Separator } from "./ui/separator";
import { Link, useNavigate } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";

function UserHoverCard({
  children,
  user,
  className,
}: {
  children?: React.ReactNode;
  user: User;
  className?: string;
}) {
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const { user: currentUser, setUser } = useContext(UserContext);
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
        }
        setIsFollowing(true);
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
        }
        setIsFollowing(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <HoverCard>
      <HoverCardTrigger className={className}>{children}</HoverCardTrigger>
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
                  {/* {user.displayName ?? user.username} */}
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

  const fetchLike = async () => {
    await countLikePost(post._id);
  };
  useEffect(() => {
    fetchLike();
  }, [user, post._id]);

  const handleLike = async () => {
    try {
      await likePost(post._id).then(() => fetchLike());
      setIsLiked(true);
    } catch (err) {
      console.log(err);
    }
  };
  const handleUnlike = async () => {
    try {
      await unLikePost(post._id).then(() => fetchLike());
      setIsLiked(false);
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
      <div className="flex px-6 pt-4 flex-row items-center">
        <UserHoverCard
          user={post.author}
          className="self-stretch grid place-items-center pr-4"
        >
          <Avatar className="w-8 h-8">
            <AvatarImage
              src={post.author.avatar}
              className="rounded-full"
              alt="@shadcn"
            />
            <AvatarFallback>{post.author.username[0]}</AvatarFallback>
          </Avatar>
        </UserHoverCard>
        <div className="">
          <UserHoverCard user={post.author}>
            <div className="font-bold">
              {post.author.displayName ?? post.author.username}
            </div>
          </UserHoverCard>
          <div className="text-muted-foreground text-sm">
            <UserHoverCard user={post.author}>
              @{post.author.username}
            </UserHoverCard>{" "}
            <Link to={`/post/detail/${post._id}`}>
              - {post.createdAt.toLocaleString()}
            </Link>
          </div>
        </div>
        <Link
          to={`/post/detail/${post._id}`}
          className="block flex-grow self-stretch"
        />
      </div>
      <Link to={`/post/detail/${post._id}`} className="block px-6 py-4">
        <p>
          {post.content
            .split("\n")
            .filter((v) => v)
            .map((v, i) => {
              return (
                <span key={i}>
                  {v}
                  <br />
                </span>
              );
            })}
        </p>
      </Link>
      {post.media && post.media.length > 0 && (
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-screen max-w-2xl pb-4"
        >
          <CarouselContent className="px-8">
            {post.media?.map((media, index) => (
              <CarouselItem key={index} className="basis-1/3">
                <div className="p-1">
                  <Card>
                    <CardContent className="aspect-square p-0">
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
        // <Carousel
        //   // className="max-w-2xl w-screen"
        //   opts={{
        //     align: "start",
        //   }}
        // >
        //   <CarouselContent>
        //     {post.media?.map((media, index) => (
        //       <CarouselItem>
        //         <Card>
        //           <CardContent>
        //           </CardContent>
        //         </Card>
        //       </CarouselItem>
        //     ))}
        //   </CarouselContent>
        // </Carousel>
      )}
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
          <CommentUI postId={post._id} post={post} />
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
