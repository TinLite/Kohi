import { ButtonScrollToTop } from "@/components/button-scroll-to-top";
import FriendSide from "@/components/friend-side";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import UserPost from "@/components/user-post";
import { getGlobalLatestPosts } from "@/repository/PostsRepository";
import { Post } from "@/types/post-type";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { useEffect, useState } from "react";

function PostCreate() {
  const [submittable, setSubmittable] = useState(false);
  const [clicked, setClicked] = useState(false);
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
          onInput={(e) => {
            console.log("tested");
            e.currentTarget.style.height = e.currentTarget.scrollHeight + "px";
            let test = e.currentTarget.value.trim().length > 0;
            if (test != submittable) setSubmittable(test);
          }}
          onFocus={() => {
            if (!clicked) setClicked(true);
          }}
        ></Textarea>
      </CardContent>
      {clicked && (
        <CardFooter className="flex justify-end">
          <Button disabled={!submittable}>Submit</Button>
        </CardFooter>
      )}
    </Card>
  );
}

export default function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);
  useEffect(() => {
    getGlobalLatestPosts().then(setPosts);
  }, []);
  return (
    <>
      <div className="flex">
        <ScrollArea className="h-screen flex-grow flex flex-col py-6">
          <div className="w-full flex justify-center">
            <div className="w-screen max-w-xl space-y-6">
              <PostCreate />
              {posts.map((post) => (
                <UserPost post={post} key={post._id} />
              ))}
            </div>
          </div>
        </ScrollArea>
        <ButtonScrollToTop />
        <FriendSide />
      </div>
    </>
  );
}
