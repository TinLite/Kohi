import { useMediaQuery } from "@/hooks/use-media-query";
import {
  getCommentByAuthor,
  hideComment,
  unHideComment,
} from "@/repository/comment-repository";
import { getPostsByAuthor, hidePost, unHidePost } from "@/repository/PostsRepository";
import { getProfileUser } from "@/repository/user-repository";
import { Post, PostFlags } from "@/types/post-type";
import { User } from "@/types/user-type";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Comment, CommentFlags } from "../../types/comment-type";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Separator } from "../ui/separator";
import { DateTime } from "luxon";
import { Input } from "../ui/input";
import { ImageViewerContext } from "@/context/image-viewer-context";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { banUser, getBanByUser, unbanUser } from "@/repository/ban-repository";
import { toast } from "sonner";
import { Ban } from "../../types/ban-types";
import { Label } from "../ui/label";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
export default function DetailUser() {
  const [target, setTarget] = useState<User | undefined>(undefined);
  const [posts, setPosts] = useState<Post[]>([]);
  const { id: authorId } = useParams();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [debouncedQuery, setDebouncedQuery] = useState<string>(""); // State cho debounce
  const { openImage } = useContext(ImageViewerContext);
  const [isBanDialogOpen, setIsBanDialogOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [types, setTypes] = useState("");
  const [typeUnban, setTypeUnban] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [bans, setBans] = useState<Ban[]>([]);
  const [openConfirmUnban, setOpenConfirmUnban] = useState(false);
  const fetchBans = async () => {
    if (!authorId) {
      return;
    }
    getBanByUser(authorId)
      .then((res) => {
        setBans(res);
      })
      .catch((error) => {
        console.error("Error fetching bans", error);
      });
  };
  const handleBanUser = async (type: string) => {
    if (!reason || !expiresAt) {
      toast.error("Please fill in all fields.");
      return;
    }
    if (!authorId) {
      toast.error("User ID is missing.");
      return;
    }
    banUser(authorId, type, reason, new Date(expiresAt))
      .then(() => {
        toast.success(`${type} banned successfully.`);
        fetchBans();
        setIsBanDialogOpen(false);
      })
      .catch((error) => {
        console.error(error);
        toast.error(`Failed to ban ${type}.`);
      });
  };
  const handleUnbanUser = async (type: string) => {
    if (!authorId) {
      toast.error("User ID is missing.");
      return;
    }
    unbanUser(authorId, type, reason)
      .then(() => {
        toast.success(`${type} unbanned successfully.`);
        fetchBans();
        setOpenConfirmUnban(false);
      })
      .catch((error) => {
        console.error(error);
        toast.error(`Failed to unban ${type}.`);
      });
  };
  const getUserProfile = async () => {
    if (!authorId) {
      return;
    }
    await getProfileUser(authorId)
      .then((response) => {
        setTarget(response);
      })
      .catch((error) => {
        console.error("Error", error);
      });
  };
  const fetchComments = () => {
    if (!authorId) return;
    getCommentByAuthor(authorId)
      .then((response) => {
        setComments(response.data || []);
        // console.log("Comments", response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch comments", error);
      });
  };
  const handleHideComment = (commentId: string) => {
    hideComment(commentId)
      .then(() => {
        toast.success("Comment hidden successfully.");
        fetchComments();
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to hide comment.");
      });
  };
  const handleUnhideComment = (commentId: string) => {
    unHideComment(commentId)
      .then(() => {
        toast.success("Comment unhidden successfully.");
        fetchComments();
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to unhide comment.");
      });
  };
  const fetchPosts = () => {
    if (!authorId) {
      return;
    }
    getPostsByAuthor(authorId)
      .then((response) => {
        setPosts(response.data || []);
      })
      .catch((error) => {
        console.error("Failed to fetch posts", error);
      });
  };

  const handleHidePost = (postId: string) => {
    hidePost(postId)
      .then(() => {
        toast.success("Post hidden successfully.");
        fetchPosts();
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to hide post.");
      });
  };

  const handleUnhidePost = (postId: string) => {
    unHidePost(postId)
      .then(() => {
        toast.success("Post unhidden successfully.");
        fetchPosts();
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to unhide post.");
      });
  };
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
  };
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery); // Cập nhật giá trị debounce sau 300ms
    }, 700);
    return () => {
      clearTimeout(handler); // Xóa timeout nếu người dùng tiếp tục nhập
    };
  }, [searchQuery]);
  const openBanDialog = (defaultType: string) => {
    setTypes(defaultType); // Đặt giá trị mặc định cho types
    setIsBanDialogOpen(true); // Mở form ban
  };

  useEffect(() => {
    getUserProfile();
    fetchPosts();
    fetchComments();
    fetchBans();
  }, [authorId]);
  const filteredPosts = posts.filter((post) =>
    post.content.toLowerCase().includes(debouncedQuery)
  );
  const filteredComments = comments.filter((comment) =>
    comment.content.toLowerCase().includes(debouncedQuery)
  );
  return (
    <div className="w-full h-screen mx-auto flex flex-col md:flex-row gap-4">
      <div className="flex-grow md:w-2/3">
        {isMobile && (
          <div className=" w-full">
            <img
              src={target?.wall || "https://github.com/QuangTeoo.png"}
              alt="Wall Image"
              className=" aspect-[3/1] inset-0 w-full h-full object-cover rounded-xl"
              onClick={() =>
                openImage(target?.wall || "https://github.com/QuangTeoo.png")
              }
            />
            <div className="flex shrink-0">
              <Avatar
                className="w-20 h-20 md:w-24 md:h-24 border-4 rounded-full mt-2"
                onClick={() =>
                  openImage(
                    target?.avatar || "https://github.com/QuangTeoo.png"
                  )
                }
              >
                <AvatarImage src={target?.avatar} alt="User Avatar" />
                <AvatarFallback>{target?.username?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col justify-center ml-2 mt-2">
                <h1 className="text-xl md:text-2xl font-bold light:text-black dark:text-white">
                  {target?.displayName}
                </h1>
                <p className="text-sm light:text-black-700 dark:text-white">
                  Username: {target?.username}
                </p>
                <p className="text-sm lightt:text-black-700 dark:text-white">
                  Email: {target?.email}
                </p>
              </div>
            </div>
          </div>
        )}
        {isMobile && (
          <div className="flex flex-col gap-2 mt-4">
            {bans && bans.some((ban) => ban.types === "account") ? (
              <Button
                variant="default"
                className="w-full py-1 text-sm font-semibold bg-green-500 hover:bg-green-600 text-white rounded-md shadow-md"
                onClick={() => {
                  setTypeUnban("account");
                  setOpenConfirmUnban(true);
                }}
              >
                Unban Account
              </Button>
            ) : (
              <Button
                variant="destructive"
                className="w-full py-1 text-sm font-semibold bg-red-500 hover:bg-red-600 text-white rounded-md shadow-md"
                onClick={() => openBanDialog("account")}
              >
                Ban Account
              </Button>
            )}
            {bans && bans.some((ban) => ban.types === "post") ? (
              <Button
                variant="default"
                className="w-full py-1 text-sm font-semibold bg-green-500 hover:bg-green-600 text-white rounded-md shadow-md"
                onClick={() => {
                  setTypeUnban("post");
                  setOpenConfirmUnban(true);
                }}
              >
                Unban Create Post
              </Button>
            ) : (
              <Button
                variant="destructive"
                className="w-full py-1 text-sm font-semibold bg-blue-500 hover:bg-blue-600 text-white rounded-md shadow-md"
                onClick={() => openBanDialog("post")}
              >
                Ban Create Post
              </Button>
            )}
            {bans && bans.some((ban) => ban.types === "comment") ? (
              <Button
                variant="default"
                className="w-full py-1 text-sm font-semibold bg-green-500 hover:bg-green-600 text-white rounded-md shadow-md"
                onClick={() => {
                  setTypeUnban("comment");
                  setOpenConfirmUnban(true);
                }}
              >
                Unban Create Comment
              </Button>
            ) : (
              <Button
                variant="destructive"
                className="w-full py-1 text-sm font-semibold bg-yellow-500 hover:bg-yellow-600 text-white rounded-md shadow-md"
                onClick={() => openBanDialog("comment")}
              >
                Ban Create Comment
              </Button>
            )}
          </div>
        )}
        <Tabs defaultValue="posts" className="w-full mt-4 ">
          <TabsList className="flex sticky top-0 z-10">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
          </TabsList>
          <Input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full block my-2 sticky top-11 bg-background z-10"
          />
          <TabsContent value="posts">
            <div className="space-y-2">
              {filteredPosts.map((post) => (
                <Card key={post._id} className="border">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4 mb-4">
                      <Avatar
                        className="w-10 h-10"
                        onClick={() => openImage(post.author.avatar || "")}
                      >
                        <AvatarImage
                          src={post.author.avatar}
                          alt={post.author.username}
                        />
                        <AvatarFallback>
                          {post.author.username.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-bold">{post.author.displayName}</p>
                        <p className="text-sm text-muted-foreground">
                          @{post.author.username} -{" "}
                          {DateTime.fromISO(
                            post.createdAt.toString()
                          ).toRelative()}
                        </p>
                      </div>
                    </div>
                    <Link
                      to={`/post/detail/${post._id}`}
                      className="block px-6 py-4"
                    >
                      <p className="hyphens-auto break-all">
                        {post.content?.split("\n").map((v, i, arr) => (
                          <span key={i}>
                            {v}
                            {i < arr.length - 1 && <br />}
                          </span>
                        ))}
                      </p>
                    </Link>
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
                      {post.flags?.includes(PostFlags.HIDDEN) ? (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleUnhidePost(post._id)}
                        >
                          Unhide
                        </Button>
                      ) : (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleHidePost(post._id)}
                        >
                          Hide
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
              {posts.length === 0 && (
                <p className="text-center text-gray-500">No posts available.</p>
              )}
            </div>
          </TabsContent>
          <TabsContent value="comments">
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableCell>Timestamp</TableCell>
                    <TableCell>Content</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredComments.length > 0 ? (
                    filteredComments.map((comment) => (
                      <TableRow key={comment._id}>
                        <TableCell>
                          {new Date(comment.timeStamp || "").toLocaleString()}
                        </TableCell>
                        <TableCell>{comment.content}</TableCell>
                        <TableCell>
                          {comment.flags?.includes(CommentFlags.HIDDEN) ? (
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleUnhideComment(comment._id)}
                            >
                              Unhide
                            </Button>
                          ) : (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleHideComment(comment._id)}
                            >
                              Hide
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center">
                        No comments available.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      {!isMobile && (
        <div className="md:w-1/3">
          <div className=" w-full">
            <img
              src={target?.wall || "https://github.com/QuangTeoo.png"}
              alt="Wall Image"
              className=" aspect-[3/1] inset-0 w-full h-full object-cover rounded-xl"
              onClick={() =>
                openImage(target?.wall || "https://github.com/QuangTeoo.png")
              }
            />
            <div className="flex shrink-0">
              <Avatar
                className="w-20 h-20 md:w-24 md:h-24 border-4 rounded-full mt-2"
                onClick={() =>
                  openImage(
                    target?.avatar || " https://github.com/QuangTeoo.png"
                  )
                }
              >
                <AvatarImage src={target?.avatar} alt="User Avatar" />
                <AvatarFallback>{target?.username?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col justify-center ml-2 mt-2">
                <h1 className="text-xl md:text-2xl font-bold light:text-black dark:text-white">
                  {target?.displayName}
                </h1>
                <p className="text-sm light:text-black-700 dark:text-white">
                  Username: {target?.username}
                </p>
                <p className="text-sm light:text-black-700 dark:text-white">
                  Email: {target?.email}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 mt-2">
            {bans && bans.some((ban) => ban.types === "account") ? (
              <Button
                variant="default"
                className="w-full py-1 text-sm font-semibold bg-green-500 hover:bg-green-600 text-white rounded-md shadow-md"
                onClick={() => {
                  setTypeUnban("account");
                  setOpenConfirmUnban(true);
                }}
              >
                Unban Account
              </Button>
            ) : (
              <Button
                variant="destructive"
                className="w-full py-1 text-sm font-semibold bg-red-500 hover:bg-red-600 text-white rounded-md shadow-md"
                onClick={() => openBanDialog("account")}
              >
                Ban Account
              </Button>
            )}
            {bans && bans.some((ban) => ban.types === "post") ? (
              <Button
                variant="default"
                className="w-full py-1 text-sm font-semibold bg-green-500 hover:bg-green-600 text-white rounded-md shadow-md"
                onClick={() => {
                  setTypeUnban("post");
                  setOpenConfirmUnban(true);
                }}
              >
                Unban Create Post
              </Button>
            ) : (
              <Button
                variant="destructive"
                className="w-full py-1 text-sm font-semibold bg-blue-500 hover:bg-blue-600 text-white rounded-md shadow-md"
                onClick={() => openBanDialog("post")}
              >
                Ban Create Post
              </Button>
            )}
            {bans && bans.some((ban) => ban.types === "comment") ? (
              <Button
                variant="default"
                className="w-full py-1 text-sm font-semibold bg-green-500 hover:bg-green-600 text-white rounded-md shadow-md"
                onClick={() => {
                  setTypeUnban("comment");
                  setOpenConfirmUnban(true);
                }}
              >
                Unban Create Comment
              </Button>
            ) : (
              <Button
                variant="destructive"
                className="w-full py-1 text-sm font-semibold bg-yellow-500 hover:bg-yellow-600 text-white rounded-md shadow-md"
                onClick={() => openBanDialog("comment")}
              >
                Ban Create Comment
              </Button>
            )}
          </div>
          <Dialog open={isBanDialogOpen} onOpenChange={setIsBanDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ban User</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-4">
                <label className="flex flex-col">
                  <span className="font-semibold">Reason</span>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="border rounded-md p-2"
                    placeholder="Enter the reason for banning"
                  />
                </label>
                <label className="flex flex-col">
                  <span className="font-semibold">Type</span>
                  <select
                    value={types}
                    onChange={(e) => setTypes(e.target.value)}
                    className="border rounded-md p-2"
                  >
                    <option value="account">Ban account</option>
                    <option value="post">Ban create post</option>
                    <option value="comment">Ban create comment</option>
                  </select>
                </label>
                <Label className="flex flex-col">
                  <span className="font-semibold mb-2">Expires At</span>
                  <input
                    type="date"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                    className="border rounded-md p-2"
                  />
                </Label>
              </div>
              <DialogFooter>
                <Button
                  variant="secondary"
                  onClick={() => setIsBanDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleBanUser(types)}
                >
                  Ban
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <AlertDialog
            open={openConfirmUnban}
            onOpenChange={setOpenConfirmUnban}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you sure you want to unban this user?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action will unban {typeUnban} the user. You can undo this
                  later.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="flex flex-col gap-4">
                <label className="flex flex-col">
                  <span className="font-semibold">Reason Unban</span>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="border rounded-md p-2"
                    placeholder="Enter the reason for unbanning"
                  />
                </label>
              </div>
              <AlertDialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setOpenConfirmUnban(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleUnbanUser(typeUnban)}
                >
                  Confirm
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </div>
  );
}
