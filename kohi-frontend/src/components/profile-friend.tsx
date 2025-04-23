import { UserContext } from "@/context/user-context";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import UserPost from "./user-post";
import UserProfileMedia from "./user-profile-media";
import { useContext, useEffect, useState } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useParams } from "react-router-dom";
import { Post } from "@/types/post-type";
import { User } from "@/types/user-type";
import { getProfileUser } from "@/repository/user-repository";
import { isFloat64Array } from "node:util/types";
import {
  getListPostShare,
  getPostsByUserId,
} from "@/repository/PostsRepository";

const ProfileFriend = () => {
  const { user, setUser } = useContext(UserContext);
  const [target, setTarget] = useState<User | undefined>(undefined);
  const [media, setMedia] = useState<Post[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [postsShare, setPostsShare] = useState<Post[]>([]);
  const { id } = useParams();
  const friends = [
    { id: 1, name: "Bill Gates", username: "@BillGates" },
    { id: 2, name: "Gmail", username: "@gmail" },
    { id: 3, name: "Google for Developers", username: "@googledevs" },
  ];
  const getUserProfile = async () => {
    if (!id) {
      return;
    }
    await getProfileUser(id)
      .then((response) => {
        setTarget(response);
      })
      .catch((error) => {
        console.error("Error", error);
      });
  };
  useEffect(() => {
    getUserProfile();
  }, [id]);
  const fetchPosts = async () => {
    getPostsByUserId(id).then(
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
  const fetchPostsShare = async () => {
    if (!id) return;
    getListPostShare(id).then(
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
  return (
    <ScrollArea className="w-full h-screen ">
      <div className="max-w-6xl mx-auto flex justify-center">
        <div className="flex-grow max-w-2xl ">
          <div className="aspect-[5/1] w-full">
            <img
              src={target?.wall || "../../public/wall/star.jpg"}
              alt="Wall Image"
              className=" w-full h-full object-cover mt-6 rounded-xl"
            />
            <div className="flex items-end gap-4 mt-6">
              <div className="flex">
                <Avatar className="w-full h-28">
                  <AvatarImage src={target?.avatar} alt="@shadcn" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </div>
              <div className="">
                <h1 className=" text-2xl font-bold">{target?.displayName}</h1>
                <div className="flex">
                  <p className="">@{target?.username}</p>
                </div>
                <div>
                  <div className="">
                    <p className="text-gray-500">
                      {target?.createAt?.toDateString()}
                    </p>
                    <p className="text-gray-500">
                      <span className="font-bold">
                        {target?.following?.length}
                      </span>{" "}
                      Following
                      <span className="font-bold ml-4">
                        {target?.followers?.length}
                      </span>{" "}
                      Followers
                    </p>
                  </div>
                  {target?.bio && (
                    <p className="text-muted-foreground">{target.bio}</p>
                  )}
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
                {posts.map((post) => (
                  <div className="mb-4" key={post._id}>
                    <UserPost
                      post={post}
                      showEditPost={user?._id == post.author._id}
                      //   onEditPost={handleEditPost || handleEditPostShare}
                      //   onUpdateShare={handleEditPostShare}
                      //   onDelete={handleDeletePost}
                    />
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="reup">
              {postsShare.map((post) => (
                <div className="mb-4" key={post._id}>
                  {post.postShare ? (
                    <UserPost
                      post={post}
                      showEditPost={user?._id == post.author._id}
                      //   onUpdateShare={handleEditPostShare}
                      //   onDelete={handleDeletePost}
                    />
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
      </div>
    </ScrollArea>
  );
};
export default ProfileFriend;
