import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { NavLink } from "react-router-dom";
import { Dialog, DialogTrigger, DialogContent } from "./ui/dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useContext, useState } from "react";
import { UserContext } from "@/context/user-context";
import { getProfile, updateUser } from "@/repository/user-repository";
import { get } from "node:http";
const UserProfile = () => {
  const friends = [
    { id: 1, name: "Bill Gates", username: "@BillGates" },
    { id: 2, name: "Gmail", username: "@gmail" },
    { id: 3, name: "Google for Developers", username: "@googledevs" },
  ];

  const { user,setUser } = useContext(UserContext);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    displayName: user?.displayName || "",
    email: user?.email || "",
    sdt: user?.sdt|| "",
    bio: user?.bio|| "",
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }
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
  const [open, setOpen] = useState(false);
  return (
    <div className="max-w-6xl mx-auto flex">
      <div className="w-3/4 mt-6">
        <div className="relative h-48">
          <img
            src="https://github.com/QuangTeoo.png"
            alt="Wall Image"
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
          <div className="absolute top-24 left-6 ">
            <Avatar className="rounded-full border-4 border-gray-800 w-24 h-24">
              <AvatarImage
                src="https://github.com/QuangTeoo.png"
                alt="@shadcn"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
          <div className="absolute top-32 left-36">
            <h1 className=" text-2xl font-bold">{user?.displayName}</h1>
            <p className="text-white">@{user?.username}</p>
          </div>
          <div className="absolute top-32 right-6">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger>
                <Button variant="secondary">Edit Profile</Button>
              </DialogTrigger>
              <DialogContent className="p-0 rounded-lg max-w-md mx-auto overflow-hidden">
                <div className="relative">
                  <div className="h-32 ">
                    <img
                      src="https://github.com/QuangTeoo.png"
                      alt="Wall"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute top-20 left-1/2 transform -translate-x-1/2">
                    <Avatar className="w-24 h-24 shadow-2xl">
                      <AvatarImage
                        src="https://github.com/QuangTeoo.png"
                        alt="@shadcn"
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </div>
                </div>
                <div className="p-6 space-y-4 mt-8">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      type="text"
                      id="username"
                      placeholder="Enter your username"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                      type="text"
                      id="displayName"
                      placeholder="Enter your display name"
                      value={formData.displayName}
                      onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm">
                      Email
                    </Label>
                    <Input
                      type="email"
                      id="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sdt" className="text-sm">
                      Phone
                    </Label>
                    <Input
                      type="text"
                      id="sdt"
                      placeholder="Enter your phone number"
                      value={formData.sdt}
                      onChange={(e) => setFormData({ ...formData, sdt: e.target.value })}
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
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    ></Textarea>
                  </div>
                </div>
                <div className="flex justify-end space-x-4 p-6  ">
                  <Button variant="default" onClick={handleSave}>Save </Button>
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
        <Tabs defaultValue="po" className="mt-4">
          <TabsList className="flex ">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="replies">Replies</TabsTrigger>
            <TabsTrigger value="articles">Articles</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="likes">Likes</TabsTrigger>
          </TabsList>
          <TabsContent value="posts">Posts content here</TabsContent>
          <TabsContent value="replies">Replies content here</TabsContent>
          <TabsContent value="articles">Articles content here</TabsContent>
          <TabsContent value="media">Media content here</TabsContent>
          <TabsContent value="likes">Likes content here</TabsContent>
        </Tabs>
      </div>
      <div className="w-1/4 p-4">
        <div className="mb-4">
          <Input
            placeholder="Search..."
            className="bg-background"
            type="text"
          />
        </div>
        <div className="bg-gray-100 p-4 rounded-lg dark:bg-gray-800 ">
          <h3 className="text-lg font-semibold mb-2">Friends</h3>
          {friends.map((friend) => (
            <div
              key={friend.id}
              className=" flex items-center justify-between mb-2"
            >
              <div
              //  className="grid grid-cols-2 gap-3"
              >
                <p className="font-medium">{friend.name}</p>
                <p className="text-gray-500">{friend.username}</p>
              </div>
              <Button variant="outline" size="sm">
                Follow
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
