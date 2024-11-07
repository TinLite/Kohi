import { Post } from "@/types/post-type";
import { Input } from "./ui/input";
import UserPost from "./user-post";
import { Button } from "./ui/button";
import { useContext, useEffect, useState } from "react";
import { getBookMarks } from "@/repository/user-repository";
import { UserContext } from "@/context/user-context";

// const samplePost: Post = {
//   _id: "1",
//   author: {
//     _id: "user1",
//     username: "shadcn",
//     displayName: "Shad CN",
//     avatar: "https://example.com/avatar.jpg",
//   },
//   content: "This is a sample post content.",
//   createdAt: new Date(),
//   comments: 5,
// };
const friends = [
  { id: 1, name: "Bill Gates", username: "@BillGates" },
  { id: 2, name: "Gmail", username: "@gmail" },
  { id: 3, name: "Google for Developers", username: "@googledevs" },
];
const BookMarkUI = () => {
  const { user } = useContext(UserContext);
  const [bookmarks, setBookmarks] = useState<Post[]>([]);

  const fetchBookmarks = async () => {
    getBookMarks().then((post) => setBookmarks(post.data));
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  return (
    <div className="w-full mt-10 flex justify-center gap-2">
      <div className="w-full max-w-xl">
        <div className="flex items-center mb-6">
          <Input
            type="text"
            placeholder="Tìm kiếm..."
            //   // value={query}
            //   onChange={handleKeyDown}
            //   // onKeyDown={handleKeyDown}
            className="bg-background"
          />
        </div>
        <div className="space-y-4">
          {bookmarks.length === 0 ? (
            <p className="text-center">There are no saved posts</p>
          ) : (
            bookmarks.map((post) => (
              <UserPost
                key={post._id}
                post={post}
                onBookmarkUpdate={fetchBookmarks}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};
export default BookMarkUI;
