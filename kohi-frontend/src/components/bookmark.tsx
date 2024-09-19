import { Post } from "@/types/post-type";
import { Input } from "./ui/input";
import UserPost from './user-post';

const samplePost: Post = {
    _id: "1",
    author: {
      _id: "user1",
      username: "shadcn",
      displayName: "Shad CN",
      avatar: "https://example.com/avatar.jpg",
    },
    content: "This is a sample post content.",
    createdAt: new Date(),
    likes: 10,
    comments: 5,
  };
const BookMarkUI = () => {
  return (
    <div className="w-full max-w-lg mx-auto mt-10 p-6 rounded-lg ">
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
      <div>
       <UserPost post={samplePost} />
      </div>
    </div>
  );
};
export default BookMarkUI;
