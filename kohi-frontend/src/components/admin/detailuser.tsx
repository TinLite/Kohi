import { useMediaQuery } from "@/hooks/use-media-query";
import { getCommentByAuthor } from "@/repository/comment-repository";
import { getPostsByAuthor } from "@/repository/PostsRepository";
import { getProfileUser } from "@/repository/user-repository";
import { Post } from "@/types/post-type";
import { User } from "@/types/user-type";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Comment } from "../../types/comment-type";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Separator } from "../ui/separator";
import { DateTime } from "luxon";
import { Input } from "../ui/input";
import { ImageViewerContext } from "@/context/image-viewer-context";
export default function DetailUser() {
  const [target, setTarget] = useState<User | undefined>(undefined);
  const [posts, setPosts] = useState<Post[]>([]);
  const { id: authorId } = useParams();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [debouncedQuery, setDebouncedQuery] = useState<string>(""); // State cho debounce
  const { openImage } = useContext(ImageViewerContext);
  const getUserProfile = async () => {
    if (!authorId) {
      return;
    }
    await getProfileUser(authorId)
      .then((response) => {
        setTarget(response);
      })
      .catch((error) => {
        console.error("Error", error);
      });
  };
  const fetchComments = async () => {
    if (!authorId) return;
    try {
      const response = await getCommentByAuthor(authorId);
      setComments(response.data || []);
    } catch (error) {
      console.error("Failed to fetch comments", error);
    }
  };
  const fetchPosts = async () => {
    try {
      if (!authorId) {
        return;
      }
      const response = await getPostsByAuthor(authorId);
      setPosts(response.data || []);
    } catch (error) {
      console.error("Failed to fetch posts", error);
    }
  };
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
  };
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery); // Cập nhật giá trị debounce sau 300ms
    },700);

    return () => {
      clearTimeout(handler); // Xóa timeout nếu người dùng tiếp tục nhập
    };
  }, [searchQuery]);
  useEffect(() => {
    getUserProfile();
    fetchPosts();
    fetchComments();
  }, [authorId]);
  const filteredPosts = posts.filter((post) =>
    post.content.toLowerCase().includes(debouncedQuery)
  );
  const filteredComments = comments.filter((comment) =>
    comment.content.toLowerCase().includes(debouncedQuery)
  );
  return (
    <div className="w-full h-screen mx-auto flex flex-col md:flex-row gap-4">
      <div className="flex-grow md:w-2/3">
        {isMobile && (
          <div className=" w-full">
            <img
              src={target?.wall || "https://github.com/QuangTeoo.png"}
              alt="Wall Image"
              className=" aspect-[3/1] inset-0 w-full h-full object-cover rounded-xl"
              onClick={() =>
                openImage(target?.wall || "https://github.com/QuangTeoo.png")
              }
            />
            <div className="flex shrink-0">
              <Avatar
                className="w-20 h-20 md:w-24 md:h-24 border-4 rounded-full mt-2"
                onClick={() =>
                  openImage(
                    target?.avatar || "https://github.com/QuangTeoo.png"
                  )
                }
              >
                <AvatarImage src={target?.avatar} alt="User Avatar" />
                <AvatarFallback>{target?.username?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col justify-center ml-2 mt-2">
                <h1 className="text-xl md:text-2xl font-bold light:text-black dark:text-white">
                  {target?.displayName}
                </h1>
                <p className="text-sm light:text-black-700 dark:text-white">
                  Username: {target?.username}
                </p>
                <p className="text-sm lightt:text-black-700 dark:text-white">
                  Email: {target?.email}
                </p>
              </div>
            </div>
          </div>
        )}
        {isMobile && (
          <div className="flex flex-col gap-2 mt-4">
            <Button
              variant="destructive"
              className="w-full py-1 text-sm font-semibold bg-red-500 hover:bg-red-600 text-white rounded-md shadow-md"
              //   onClick={handleBanUser}
            >
              Ban User
            </Button>
            <Button
              variant="default"
              className="w-full py-1 text-sm font-semibold bg-blue-500 hover:bg-blue-600 text-white rounded-md shadow-md"
              //   onClick={handleUnbanUser}
            >
              Unban User
            </Button>
            <Button
              variant="destructive"
              className="w-full py-1 text-sm font-semibold bg-yellow-500 hover:bg-yellow-600 text-white rounded-md shadow-md"
              //   onClick={() => handleBanComment("commentId")}
            >
              Ban Comment
            </Button>
          </div>
        )}
        <Tabs defaultValue="posts" className="w-full mt-4 ">
          <TabsList className="flex sticky top-0 z-10">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
          </TabsList>
          <Input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full block my-2 sticky top-11 bg-background z-10"
          />
          <TabsContent value="posts">
            <div className="space-y-2">
              {filteredPosts.map((post) => (
                <Card key={post._id} className="border">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4 mb-4">
                      <Avatar
                        className="w-10 h-10"
                        onClick={() => openImage(post.author.avatar || "")}
                      >
                        <AvatarImage
                          src={post.author.avatar}
                          alt={post.author.username}
                        />
                        <AvatarFallback>
                          {post.author.username.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-bold">{post.author.displayName}</p>
                        <p className="text-sm text-muted-foreground">
                          @{post.author.username} -{" "}
                          {DateTime.fromISO(
                            post.createdAt.toString()
                          ).toRelative()}
                        </p>
                      </div>
                    </div>
                    <Link
                      to={`/post/detail/${post._id}`}
                      className="block px-6 py-4"
                    >
                      <p className="hyphens-auto break-all">
                        {post.content?.split("\n").map((v, i, arr) => (
                          <span key={i}>
                            {v}
                            {i < arr.length - 1 && <br />}
                          </span>
                        ))}
                      </p>
                    </Link>
                    {post.media && post.media.length > 0 && (
                      <Carousel
                        opts={{
                          align: "start",
                        }}
                        className="w-full max-w-2xl pb-4"
                      >
                        <CarouselContent className="px-8 mr-4">
                          {post.media?.map((media, index) => (
                            <CarouselItem key={index} className="basis-1/3">
                              <div className="p-1">
                                <Card>
                                  <CardContent
                                    className="aspect-square p-0"
                                    onClick={() => openImage(media)}
                                  >
                                    <img
                                      key={index}
                                      src={media}
                                      alt="media"
                                      className="object-cover w-full h-full rounded-lg"
                                    />
                                  </CardContent>
                                </Card>
                              </div>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        <CarouselPrevious className="left-8 disabled:opacity-5" />
                        <CarouselNext className="right-8 disabled:opacity-5" />
                      </Carousel>
                    )}
                    <Separator />
                    <div className="flex justify-end gap-2 mt-2">
                      <Button variant="default" size="sm">
                        Hide
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {posts.length === 0 && (
                <p className="text-center text-gray-500">No posts available.</p>
              )}
            </div>
          </TabsContent>
          <TabsContent value="comments">
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableCell>Timestamp</TableCell>
                    <TableCell>Content</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredComments.length > 0 ? (
                    filteredComments.map((comment) => (
                      <TableRow key={comment._id}>
                        <TableCell>
                          {new Date(comment.timeStamp || "").toLocaleString()}
                        </TableCell>
                        <TableCell>{comment.content}</TableCell>
                        <TableCell>
                          <Button
                            variant="destructive"
                            size="sm"
                            // onClick={() => handleDeleteComment(comment._id)}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center">
                        Không có comment nào.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      {!isMobile && (
        <div className="md:w-1/3">
          <div className=" w-full">
            <img
              src={target?.wall || "https://github.com/QuangTeoo.png"}
              alt="Wall Image"
              className=" aspect-[3/1] inset-0 w-full h-full object-cover rounded-xl"
              onClick={() =>
                openImage(target?.wall || "https://github.com/QuangTeoo.png")
              }
            />
            <div className="flex shrink-0">
              <Avatar
                className="w-20 h-20 md:w-24 md:h-24 border-4 rounded-full mt-2"
                onClick={() =>
                  openImage(
                    target?.avatar || " https://github.com/QuangTeoo.png"
                  )
                }
              >
                <AvatarImage src={target?.avatar} alt="User Avatar" />
                <AvatarFallback>{target?.username?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col justify-center ml-2 mt-2">
                <h1 className="text-xl md:text-2xl font-bold light:text-black dark:text-white">
                  {target?.displayName}
                </h1>
                <p className="text-sm light:text-black-700 dark:text-white">
                  Username: {target?.username}
                </p>
                <p className="text-sm light:text-black-700 dark:text-white">
                  Email: {target?.email}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 mt-2">
            <Button
              variant="destructive"
              className="w-full py-1 text-sm font-semibold bg-red-500 hover:bg-red-600 text-white rounded-md shadow-md"
              //   onClick={handleBanUser}
            >
              Ban User
            </Button>
            <Button
              variant="default"
              className="w-full py-1 text-sm font-semibold bg-blue-500 hover:bg-blue-600 text-white rounded-md shadow-md"
              //   onClick={handleUnbanUser}
            >
              Ban Create Post
            </Button>
            <Button
              variant="destructive"
              className="w-full py-1 text-sm font-semibold bg-yellow-500 hover:bg-yellow-600 text-white rounded-md shadow-md"
              //   onClick={() => handleBanComment("commentId")}
            >
              Ban Create Comment
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
