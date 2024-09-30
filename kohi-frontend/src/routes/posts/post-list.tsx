import { ButtonScrollToTop } from "@/components/button-scroll-to-top";
import FriendSide from "@/components/friend-side";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import UserPost from "@/components/user-post";
import {
  createPosts,
  getGlobalLatestPosts,
} from "@/repository/PostsRepository";
import { Post } from "@/types/post-type";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { useEffect, useState } from "react";

function PostCreate({ onSubmit }: { onSubmit: () => void }) {
  const [submittable, setSubmittable] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [content, setContent] = useState("");

  const handleSubmit = async () => {
    try {
      await createPosts(content);
      setContent("");
      setSubmittable(false);
      setClicked(false);
      onSubmit();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Card>
      <CardContent className="flex p-6 gap-6">
        <Avatar className="w-8 h-8">
          <AvatarImage
            src="https://github.com/shadcn.png"
            className="rounded-full"
            alt="@shadcn"
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <Textarea
          className="resize-y p-0 border-0 focus-visible:ring-0 min-h-0"
          placeholder="How are you today?"
          value={content}
          onInput={(e) => {
            const value = e.currentTarget.value;
            e.currentTarget.style.height = e.currentTarget.scrollHeight + "px";
            let isSubmittable = value.trim().length > 0;
            setSubmittable(isSubmittable);
            setContent(value);
          }}
          onFocus={() => {
            if (!clicked) setClicked(true);
          }}
        ></Textarea>
      </CardContent>
      {clicked && (
        <CardFooter className="flex justify-end">
          <Button disabled={!submittable} onClick={handleSubmit}>
            Submit
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

export default function PostList() {
  function refreshPost() {
    getGlobalLatestPosts().then(setPosts);
  }

  const [posts, setPosts] = useState<Post[]>([]);
  useEffect(() => {
    refreshPost();
  }, []);
  return (
    <>
      <div className="flex">
        <div className="h-screen flex-grow">
          <div className="w-full flex justify-center gap-4">
            <ScrollArea className="w-screen h-screen max-w-xl">
              <div className="space-y-6 py-6 md:mb-0 mb-12 md:pr-4">
                <PostCreate onSubmit={refreshPost} />
                {posts.map((post) => (
                  <UserPost post={post} key={post._id} />
                ))}
              </div>
            </ScrollArea>
            <FriendSide />
          </div>
        </div>
        <ButtonScrollToTop />
      </div>
    </>
  );
}
