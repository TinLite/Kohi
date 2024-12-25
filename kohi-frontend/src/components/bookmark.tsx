import { Post } from "@/types/post-type";
import { Input } from "./ui/input";
import UserPost from "./user-post";
import { Button } from "./ui/button";
import { useContext, useEffect, useState } from "react";
import { getBookMarks, searchBookMarks } from "@/repository/user-repository";
import { UserContext } from "@/context/user-context";
import { ScrollArea } from "./ui/scroll-area";

const friends = [
  { id: 1, name: "Bill Gates", username: "@BillGates" },
  { id: 2, name: "Gmail", username: "@gmail" },
  { id: 3, name: "Google for Developers", username: "@googledevs" },
];
const BookMarkUI = () => {
  const { user } = useContext(UserContext);
  const [bookmarks, setBookmarks] = useState<Post[]>([]);
  const [searchBookmarks, setSearchBookmarks] = useState<Post[]>([]);
  const [query, setQuery] = useState("");

  const fetchBookmarks = async () => {
    getBookMarks().then((post) => {
      setBookmarks(post.data);
      setSearchBookmarks(post.data);
    });
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query === "") {
        setSearchBookmarks(bookmarks);
      } else {
        searchBookMarks(query)
          .then((result) => {
            setSearchBookmarks(result);
          })
          .catch((error) => {
            console.error("Error", error);
          });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [query, bookmarks]);
  const handleEditPost = () => {
    fetchBookmarks();
  };
  const handleEditPostShare = () => {
    fetchBookmarks();
  };
  const handleLikePost = () => {
    fetchBookmarks();
  };
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };
  return (
    <ScrollArea className="w-full h-screen ">
      <div className="mt-10 flex justify-center">
        <div className="w-full max-w-2xl">
          <div className="flex items-center mb-4 ">
            <h1 className="text-2xl font-bold">Bookmarks</h1>
          </div>
          <div className="flex items-center mb-4">
            <Input
              type="text"
              placeholder="Tìm kiếm..."
              value={query}
              onChange={handleSearchChange}
              className="bg-background max-w-3xl"
            />
          </div>
          <div className="space-y-4">
            {searchBookmarks.length === 0 ? (
              <p className="text-center">There are no saved posts</p>
            ) : (
              searchBookmarks.map((post) => (
                <div key={post._id}>
                  <UserPost
                    post={post}
                    onBookmarkUpdate={fetchBookmarks}
                    showEditPost={user?._id == post.author._id}
                    onEditPost={handleEditPost}
                    onUpdateShare={handleEditPostShare}
                    onUpdateLike={handleLikePost}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};
export default BookMarkUI;
