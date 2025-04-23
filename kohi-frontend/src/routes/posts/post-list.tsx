import { ButtonScrollToTop } from "@/components/button-scroll-to-top";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import UserPost from "@/components/user-post";
import { UserContext } from "@/context/user-context";
import {
  createPosts,
  getGlobalLatestPosts,
} from "@/repository/PostsRepository";
import { Post } from "@/types/post-type";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

function PostCreate({ onSubmit }: { onSubmit: () => void }) {
  const [submittable, setSubmittable] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [content, setContent] = useState("");
  const [selectedFile, setSelectedFile] = useState<File[]>([]);

  const { user, setLoginFormOpen } = useContext(UserContext);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(Array.from(e.target.files));
    }
  };
  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("content", content);
    if (selectedFile) {
      selectedFile.map((file) => {
        formData.append("files", file);
      });
    }
    if (!user) {
      toast.error("Please login to post");
      setLoginFormOpen(true);
      return;
    }
    try {
      await createPosts(formData);
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
            src={user?.avatar ?? ""}
            className="rounded-full"
            alt={`@${user?.username ?? "user"}`}
          />
          <AvatarFallback>@</AvatarFallback>
        </Avatar>
        <Textarea
          className="resize-y p-0 border-0 focus-visible:ring-0 min-h-0"
          placeholder="How are you today?"
          value={content}
          onInput={(e) => {
            const value = e.currentTarget.value;
            e.currentTarget.style.height = "auto";
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
        <CardFooter className="flex justify-end gap-4">
          <Input
            type="file"
            className="file:text-foreground"
            onChange={handleFileChange}
            multiple
            capture
          />
          <Button disabled={!submittable} onClick={handleSubmit}>
            Submit
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

export default function PostList() {
  const { user } = useContext(UserContext);
  function refreshPost() {
    getGlobalLatestPosts().then(setPosts);
  }

  const [posts, setPosts] = useState<Post[]>([]);
  useEffect(() => {
    if (user) refreshPost();
    else setPosts([]);
  }, [user]);
  return (
    <>
      <div className="sticky flex md:hidden top-0 w-full bg-background border-b border-muted px-4 pt-2 pb-8">
        <Link to="/" className="font-bold text-sm">
          コー
          <br />
          ヒー
        </Link>
      </div>
      <div className="flex">
        <div className="h-screen flex-grow">
          <div className="w-full flex justify-center gap-4">
            <ScrollArea className="w-full h-dvh">
              <div className="space-y-6 py-6 mx-auto md:mb-0 mb-12 xl:pr-4 max-w-2xl">
                {user && <PostCreate onSubmit={refreshPost} />}
                {posts.map((post) => (
                  <UserPost
                    post={post}
                    key={post._id}
                    showEditPost={user?._id == post.author._id}
                    onDelete={refreshPost}
                    onRepost={refreshPost}
                    onUpdateShare={refreshPost}
                    onShareQuote={refreshPost}
                    onUpdateLike={refreshPost}
                  />
                ))}
              </div>
            </ScrollArea>
            {/* <div className="hidden xl:block">
              <FriendSide />
            </div> */}
          </div>
        </div>
        <ButtonScrollToTop />
      </div>
    </>
  );
}
