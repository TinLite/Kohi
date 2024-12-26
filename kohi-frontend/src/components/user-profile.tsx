import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserContext } from "@/context/user-context";
import {
  getListPostShare,
  getPostsByUserId
} from "@/repository/PostsRepository";
import {
  getProfile,
  updateAvatar,
  updateUser,
  updateWall,
} from "@/repository/user-repository";
import { Post } from "@/types/post-type";
import { AlertDialogTrigger } from "@radix-ui/react-alert-dialog";
import { useContext, useEffect, useRef, useState } from "react";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter } from "./ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import UserPost from "./user-post";
import UserProfileMedia from "./user-profile-media";
const UserProfile = () => {
  const [media, setMedia] = useState<Post[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [postsShare, setPostsShare] = useState<Post[]>([]);
  const { user, setUser } = useContext(UserContext);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const wallInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    displayName: user?.displayName || "",
    email: user?.email || "",
    sdt: user?.sdt || "",
    bio: user?.bio || "",
  });
  useEffect(() => {
    setFormData({
      username: user?.username || "",
      displayName: user?.displayName || "",
      email: user?.email || "",
      sdt: user?.sdt || "",
      bio: user?.bio || "",
    });
  }, [user]);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSave = () => {
    if (user?._id) {
      updateUser(user._id, formData)
        .then((updatedUser) => {
          console.log("success", updatedUser);
          setOpen(false);
          getProfile().then(setUser);
        })
        .catch((error) => {
          console.error("Error", error);
        });
    } else {
      console.error("Cannot update profile.");
    }
  };

  const fetchPosts = async () => {
    getPostsByUserId().then(
      (data) => {
        setPosts(data);
        const mediaPosts = data.filter(
          (post) => post.media && post.media.length > 0
        );
        setMedia(mediaPosts);
      },
      (error) => {
        console.error("Failed to fetch posts", error);
      }
    );
  };
  useEffect(() => {
    fetchPosts();
  }, [user]);
  const handleEditPost = () => {
    fetchPosts();
  };
  const fetchPostsShare = async () => {
    getListPostShare().then(
      (data) => {
        console.log("sharepost" + data);
        setPostsShare(data);
      },
      (error) => {
        console.error("Failed to fetch posts", error);
      }
    );
  };
  useEffect(() => {
    fetchPostsShare();
  }, [user]);
  const handleEditPostShare = () => {
    fetchPostsShare();
  };
  const handleDeletePost = () => {
    fetchPosts();
  };
  const handleLikePost = () => {
    fetchPosts();
    fetchPostsShare();
  };
  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const handleWallClick = () => {
    if (wallInputRef.current) {
      wallInputRef.current.click();
    }
  };
  const handleAvatarChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file && user?._id) {
      const formData = new FormData();
      formData.append("file", file);
      const updatedUser = await updateAvatar(user._id, formData)
        .then(() => getProfile().then(setUser))
        .catch((error) => {
          console.error("Failed to update avatar", error);
        });
    }
  };

  const handleWallChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file && user?._id) {
      const formData = new FormData();
      formData.append("file", file);
      const updatedUser = await updateWall(user._id, formData)
        .then(() => getProfile().then(setUser))
        .catch((error) => {
          console.error("Failed to update avatar", error);
        });
    }
  };
  const [open, setOpen] = useState(false);
  return (
    <ScrollArea className="w-full h-screen">
      <div className="max-w-6xl mx-auto flex justify-center">
        <div className="flex-grow max-w-2xl ">
          <div className="aspect-[3/1] md:aspect-[5/1] w-full">
            <img
              src={user?.wall}
              alt="Wall Image"
              className=" w-full h-full object-cover md:mt-6 md:rounded-xl"
            />
            <div className="flex items-end gap-4 mt-6">
              <div className="flex shrink-0">
                <Avatar className="w-full h-28">
                  <AvatarImage src={user?.avatar} alt="@shadcn" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex-grow">
                <h1 className=" text-2xl font-bold">{user?.displayName}</h1>
                <div className="flex">
                  <p>@{user?.username}</p>
                </div>
                <div>
                  <div>
                    <p className="text-gray-500">
                      {user?.createAt?.toDateString()}
                    </p>
                    <p className="text-gray-500">
                      <span className="font-bold">
                        {user?.following?.length}
                      </span>{" "}
                      Following
                      <span className="font-bold ml-4">
                        {user?.followers?.length}
                      </span>{" "}
                      Followers
                    </p>
                  </div>
                  <div className="flex gap-2 w-full">
                    {user?.bio && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <p className="text-muted-foreground break-all line-clamp-2 cursor-pointer">{user.bio.split("\n").map((v, i, arr) => {
                            return <span key={i}>{v}{i < arr.length - 1 && <br />}</span>
                          })}</p>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogDescription>
                            {user.bio.split("\n").map((v, i, arr) => {
                              return <span key={i}>{v}{i < arr.length - 1 && <br />}</span>
                            })}
                          </AlertDialogDescription>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Close</AlertDialogCancel>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                    <Dialog open={open} onOpenChange={setOpen}>
                      <DialogTrigger className="ml-auto mr-4">
                        <Button variant="outline">Edit Profile</Button>
                      </DialogTrigger>
                      <DialogContent className="p-0 rounded-lg max-w-md mx-auto overflow-hidden">
                        <div className="relative h-48">
                          <img
                            src={user?.wall || user?.displayName}
                            alt="Wall"
                            className="w-full h-full object-cover  "
                            onClick={handleWallClick}
                          />
                          <input
                            type="file"
                            className="hidden"
                            ref={wallInputRef}
                            accept="image/*"
                            onChange={handleWallChange}
                          />
                          <div className="absolute top-24 left-2  ">
                            <Avatar
                              className="rounded-full border-4 border-gray-800 w-24 h-24"
                              onClick={handleAvatarClick}
                            >
                              <AvatarImage
                                src={user?.avatar || user?.displayName}
                                alt="@shadcn"
                              />
                              <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <input
                              type="file"
                              ref={fileInputRef}
                              className="hidden"
                              accept="image/*"
                              onChange={handleAvatarChange}
                            />
                          </div>
                        </div>
                        <div className="pl-6 pr-6 pb-2 space-y-2 ">
                          <div className="space-y-2">
                            <Label htmlFor="displayName">Display Name</Label>
                            <Input
                              type="text"
                              id="displayName"
                              placeholder="Enter your display name"
                              value={formData.displayName}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  displayName: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="bio" className="text-sm">
                              Bio
                            </Label>
                            <Textarea
                              id="bio"
                              placeholder="Write something about yourself"
                              value={formData.bio}
                              onChange={(e) =>
                                setFormData({ ...formData, bio: e.target.value })
                              }
                            ></Textarea>
                          </div>
                          <div className="flex justify-end space-x-4">
                            <Button variant="default" onClick={handleSave}>
                              Save{" "}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Tabs defaultValue="posts">
            <TabsList className="flex ">
              <TabsTrigger value="posts">Posts</TabsTrigger>
              <TabsTrigger value="reup">Share</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
            </TabsList>
            <TabsContent value="posts">
              <div className="md:mb-0 mb-16">
                {posts.length > 0 ? (
                  posts.map((post) => (
                    <div className="mb-4" key={post._id}>
                      <UserPost
                        post={post}
                        showEditPost={user?._id == post.author._id}
                        onEditPost={handleEditPost || handleEditPostShare}
                        onUpdateShare={handleEditPostShare}
                        onDelete={handleDeletePost}
                        onUpdateLike={handleLikePost}
                      />
                    </div>
                  ))
                ) : (
                  <p>No posts available.</p>
                )}
              </div>
            </TabsContent>
            <TabsContent value="reup">
              {postsShare.length > 0 ? (
                postsShare.map((post) => (
                  <div className="mb-4" key={post._id}>
                    {post.postShare ? (
                      <UserPost
                        post={post}
                        showEditPost={user?._id == post.author._id}
                        onUpdateShare={handleEditPostShare}
                        onDelete={handleDeletePost}
                        onUpdateLike={handleLikePost}
                      />
                    ) : (
                      <div>No content available</div>
                    )}
                  </div>
                ))
              ) : (
                <p>No shared posts available.</p>
              )}
            </TabsContent>
            <TabsContent value="media">
              <div className="mb-4">
                <UserProfileMedia posts={media} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ScrollArea>
  );
};
export default UserProfile;
