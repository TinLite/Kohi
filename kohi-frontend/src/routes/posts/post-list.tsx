import { ButtonScrollToTop } from "@/components/button-scroll-to-top";
import FriendSide from "@/components/friend-side";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
  const { user, setLoginFormOpen } = useContext(UserContext);
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
      <div className="sticky flex lg:hidden top-0 w-full bg-background border-b border-muted px-4 pt-2 pb-8">
        <Link to="/" className="font-bold text-sm">
          コー
          <br />
          ヒー
        </Link>
      </div>
      <div className="flex">
        <div className="flex-grow">
          {
            user ? (
              <>
                <div className="w-full flex justify-center gap-4">
                  <div className="space-y-6 py-6 mx-auto lg:mb-0 mb-12 xl:pr-4 max-w-2xl w-dvw">
                    <PostCreate onSubmit={refreshPost} />
                    {posts.map((post) => (
                      <UserPost
                        post={post}
                        key={post._id}
                        showEditPost={user?._id === post.author._id}
                        onDelete={refreshPost}
                        onRepost={refreshPost}
                        onUpdateShare={refreshPost}
                        onShareQuote={refreshPost}
                        onUpdateLike={refreshPost}
                        lineClampNumber={3}
                      />
                    ))}
                  </div>
                </div>
              </>
            )
              : (
                <div className="flex flex-col items-center justify-center lg:h-dvh h-[calc(100vh-9.5rem)]">
                  <h1 className="text-2xl font-bold mb-4">Welcome to コーヒー</h1>
                  <p className="text-lg mb-4">Unwind yourself, let's have fun together!</p>
                  <Button onClick={() => setLoginFormOpen(true)}>Login</Button>
                </div>
              )
          }
        </div>
        {
          user &&
          <FriendSide />
        }
        <ButtonScrollToTop />
      </div>
    </>
  );
}
