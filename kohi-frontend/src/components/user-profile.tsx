import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { NavLink } from "react-router-dom";
import { Dialog, DialogTrigger, DialogContent } from "./ui/dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "@/context/user-context";
import {
  getProfile,
  updateAvatar,
  updateUser,
  updateWall,
} from "@/repository/user-repository";
import { get } from "node:http";
import { Post } from "@/types/post-type";
import {
  getListPostShare,
  getMediaByUserId,
  getPostsByUserId,
} from "@/repository/PostsRepository";
import UserPost from "./user-post";
import { ScrollArea } from "@/components/ui/scroll-area";
import UserProfileMedia from "./user-profile-media";
const UserProfile = () => {
  const friends = [
    { id: 1, name: "Bill Gates", username: "@BillGates" },
    { id: 2, name: "Gmail", username: "@gmail" },
    { id: 3, name: "Google for Developers", username: "@googledevs" },
  ];
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
  useEffect(() => {
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
  }, [user]);
  useEffect(() => {
    getListPostShare().then(
      (data) => {
        console.log("sharepost" + data);
        setPostsShare(data);
      },
      (error) => {
        console.error("Failed to fetch posts", error);
      }
    );
  }, [user]);

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
    <ScrollArea className="w-full h-screen ">
      <div className="max-w-6xl mx-auto flex justify-center">
        <div className="flex-grow max-w-2xl mt-6">
          <div className="relative h-64">
            <img
              src={user?.wall}
              alt="Wall Image"
              className=" w-full h-full object-cover"
            />
            <div className="absolute bottom-0 w-full bg-gradient-to-t from-background h-full opacity-50"></div>
            <div className="absolute top-36 left-6 ">
              <Avatar className="rounded-full border-4 border-gray-800 w-24 h-24">
                <AvatarImage src={user?.avatar} alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
            <div className="absolute top-44 left-36 text-white">
              <h1 className=" text-2xl font-bold">{user?.displayName}</h1>
              <p className="text-black">@{user?.username}</p>
            </div>
            <div className="absolute top-48 right-6">
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger>
                  <Button variant="secondary">Edit Profile</Button>
                </DialogTrigger>
                <DialogContent className="p-0 rounded-lg max-w-md mx-auto overflow-hidden">
                  <div className="relative h-48">
                    <img
                      src={user?.wall || user?.displayName}
                      alt="Wall"
                      className="w-full h-full object-cover"
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
          <div className="p-4">
            <p className="text-gray-500">{user?.createAt?.toDateString()}</p>
            <p className="text-gray-500">
              <span className="font-bold">{user?.following?.length}</span>{" "}
              Following
              <span className="font-bold ml-4">
                {user?.followers?.length}
              </span>{" "}
              Followers
            </p>
          </div>
          <div>
            {user?.bio && (
              <p className="flex justify-center pb-2">{user.bio}</p>
            )}
          </div>
          <Tabs defaultValue="posts">
            <TabsList className="flex ">
              <TabsTrigger value="posts">Posts</TabsTrigger>
              <TabsTrigger value="reup">Share</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
            </TabsList>
            <TabsContent value="posts">
              <div className="md:mb-0 mb-16">
                {posts.map((post) => (
                  <div className="mb-4" key={post._id}>
                    <UserPost post={post} />
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="reup">
              {postsShare.map((post) => (
                <div className="mb-4" key={post._id}>
                  {post.postShare ? (
                    <UserPost post={post} />
                  ) : (
                    <div>No content available</div>
                  )}
                </div>
              ))}
            </TabsContent>
            <TabsContent value="media">
              <div className="mb-4">
                <UserProfileMedia posts={media} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
        <div className="hidden xl:block w-full max-w-xs p-4">
          <div className="mb-4">
            <Input
              placeholder="Search..."
              className="bg-background"
              type="text"
            />
          </div>
          <div className="p-4 rounded-lg bg-background ">
            <h3 className="text-lg font-semibold mb-2">Friends</h3>
            {friends.map((friend) => (
              <div
                key={friend.id}
                className=" flex items-center justify-between mb-2"
              >
                <div>
                  <p className="font-medium">{friend.name}</p>
                  <p className="text-muted-foreground">{friend.username}</p>
                </div>
                <Button variant="default" size="sm">
                  Follow
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};
export default UserProfile;
