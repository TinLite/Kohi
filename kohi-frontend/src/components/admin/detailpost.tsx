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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

export default function DetailPost() {
  const { id: postId } = useParams();
  const { openImage } = useContext(ImageViewerContext);
  const [post, setPost] = useState<Post | null>(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [actionType, setActionType] = useState<"hide" | "unhide" | null>(null);

  const handleConfirm = () => {
    if (!post) return;
    if (actionType === "hide") handleHidePost(post._id);
    if (actionType === "unhide") handleUnhidePost(post._id);
    setOpenConfirm(false);
    setActionType(null);
  };

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
    <div className="w-full min-h-screen flex justify-center items-start p-6">
      <Card className="w-full max-w-3xl shadow-xl rounded-2xl overflow-hidden">
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
              <p className="font-bold">
                {post?.author.displayName || post?.author.username}
              </p>
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
                onClick={() => {
                  setActionType("unhide");
                  setOpenConfirm(true);
                }}
              >
                Unhide
              </Button>
            ) : (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  setActionType("hide");
                  setOpenConfirm(true);
                }}
              >
                Hide
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      <AlertDialog open={openConfirm} onOpenChange={setOpenConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === "hide"
                ? "Are you sure you want to hide this post?"
                : "Are you sure you want to unhide this post?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              You can undo this action later in the admin panel.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpenConfirm(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>
              {actionType === "hide" ? "Confirm hide" : "Confirm unhide"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
