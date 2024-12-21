import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { searchPosts } from "@/repository/PostsRepository";
import {
  followUser,
  getFollowing,
  searchUsers,
} from "@/repository/user-repository";
import { Post } from "@/types/post-type";
import { User } from "@/types/user-type";
import { useContext, useEffect, useState } from "react";
import { Input } from "./ui/input";
import UserInfo from "./user-info";
import UserPost from "./user-post";
import { UserContext } from "@/context/user-context";

const SearchUI = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const {user: currentUser,setUser} = useContext(UserContext);

  const handleSearch = async (query: string) => {
    if (query.trim() !== "") {
      setError(null);
      try {
        const resultPosts: Post[] = await searchPosts(query);
        setPosts(resultPosts);
        const resultUsers: User[] = await searchUsers(query);
        setUsers(resultUsers);
      } catch (err) {
        setError("Không thể tìm kiếm");
      } finally {
        setLoading(false);
      }
    } else {
      setPosts([]);
      setError("You cần nhập từ khóa tìm kiếm");
    }
  };
  var timer: NodeJS.Timeout;
  const handleKeyDown = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("lmao", e.target.value);
    clearTimeout(timer);
    timer = setTimeout(() => {
      handleSearch(e.target.value);
    }, 500);
  };
  return (
    <div className="w-full max-w-lg mx-auto mt-10 p-6 rounded-lg  ">
      <div className="flex items-center mb-6">
        <Input
          type="text"
          placeholder="Tìm kiếm..."
          onChange={handleKeyDown}
          className="bg-background"
        />
      </div>

      <Tabs defaultValue="posts" className="p-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="people">People</TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="space-y-2">
          {error ? (
            <p>{error}</p>
          ) : posts.length > 0 ? (
            posts.map((post) => <UserPost key={post._id} post={post} />)
          ) : (
            <p>Không tìm thấy bài viết nào.</p>
          )}
        </TabsContent>

        <TabsContent value="people" className="space-y-2">
          {error ? (
            <p>{error}</p>
          ) : users.length > 0 ? (
            users.map((searchResultEntry) => (
              <UserInfo
                key={searchResultEntry._id}
                user={searchResultEntry}
                isFollowed={
                 currentUser?.following?.includes(searchResultEntry._id)
                }
              />
            ))
          ) : (
            <p>Không tìm thấy người dùng nào.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
export default SearchUI;
