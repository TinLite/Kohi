import { Link, useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardContent } from "../ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { Post, PostFlags } from "@/types/post-type";
import { useContext, useEffect, useState } from "react";
import {
  getOnePostByAdmin,
  hidePost,
  unHidePost,
} from "@/repository/PostsRepository";
import { ImageViewerContext } from "@/context/image-viewer-context";
import { DateTime } from "luxon";

export default function DetailPost() {
  const { id: postId } = useParams();
  const { openImage } = useContext(ImageViewerContext);
  const [post, setPost] = useState<Post | null>(null);
  const fetchPost = async () => {
    if (!postId) return;
    getOnePostByAdmin(postId)
      .then((response) => {
        setPost(response);
      })
      .catch((error) => {
        console.error("Failed to fetch post details:", error);
      });
  };
  const handleHidePost = (postId: string) => {
    if (!postId) return;
    hidePost(postId)
      .then(() => {
        fetchPost();
      })
      .catch((error) => {
        console.error("Failed to hide post:", error);
      });
  };
  const handleUnhidePost = (postId: string) => {
    if (!postId) return;
    unHidePost(postId)
      .then(() => {
        fetchPost();
      })
      .catch((error) => {
        console.error("Failed to unhide post:", error);
      });
  };
  useEffect(() => {
    fetchPost();
  }, [postId]);
  return (
    <div className="space-y-2 max-w-4xl">
      <Card className="border">
        <CardContent className="p-4">
          <div className="flex items-center gap-4 mb-4">
            <Avatar
              className="w-10 h-10"
              onClick={() => openImage(post?.author.avatar || "")}
            >
              <AvatarImage
                src={post?.author.avatar}
                alt={post?.author.username}
              />
              <AvatarFallback>{post?.author.username.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-bold">{post?.author.displayName || post?.author.username}</p>
              <p className="text-sm text-muted-foreground">
                @{post?.author.username} -{" "}
                {post?.createdAt
                  ? DateTime.fromISO(post.createdAt.toString()).toRelative()
                  : "Unknown time"}
              </p>
            </div>
          </div>
          {post && (
            <div className="block px-6 py-4">
              <p className="hyphens-auto break-all">
                {post?.content?.split("\n").map((v, i, arr) => (
                  <span key={i}>
                    {v}
                    {i < arr.length - 1 && <br />}
                  </span>
                ))}
              </p>
            </div>
          )}
          {post?.media && post.media.length > 0 && (
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
                        <CardContent
                          className="aspect-square p-0"
                          onClick={() => openImage(media)}
                        >
                          <img
                            key={index}
                            src={media}
                            alt="media"
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
          <Separator />
          <div className="flex justify-end gap-2 mt-2">
            {post?.flags?.includes(PostFlags.HIDDEN) ? (
              <Button
                variant="default"
                size="sm"
                onClick={() => post && handleUnhidePost(post._id)}
              >
                Unhide
              </Button>
            ) : (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => post && handleHidePost(post._id)}
              >
                Hide
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
