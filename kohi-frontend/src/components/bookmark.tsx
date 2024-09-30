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
    <div className="w-full max-w-lg mx-auto mt-10 p-6 rounded-lg bg-background">
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
      <div className="absolute top-8 right-10 w-1/4 p-4 ">
        <div className="mb-4">
          <Input
            placeholder="Search..."
            className="bg-background"
            type="text"
          />
        </div>
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Friends</h3>
          {friends.map((friend) => (
            <div
              key={friend.id}
              className=" flex items-center justify-between mb-2 "
            >
              <div>
                <p className="font-medium">{friend.name}</p>
                <p className="text-gray-500">{friend.username}</p>
              </div>
              <Button variant="outline">Follow</Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default BookMarkUI;
