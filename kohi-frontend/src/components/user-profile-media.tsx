import { Post } from "@/types/post-type";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

export default function UserProfileMedia({ posts }: { posts: Post[] }) {
  return (
    <div className="grid grid-cols-3 gap-1 sm:gap-2 md:gap-4">
      {posts.map((post) =>
        post.media.map((url, index) => (
          <div key={index} className="mb-4">
            <Link
              to={`/post/detail/${post._id}`}
              className="block flex-grow self-stretch"
            >
              <img
                src={url}
                className="w-full h-auto rounded-lg shadow-md object-cover aspect-square"
              />
            </Link>
          </div>
        ))
      )}
    </div>
  );
}
