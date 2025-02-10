import { useContext, useEffect, useState } from "react";
import { Post } from "@/types/post-type";
import { Comment } from "@/types/comment-type";
import UserPost from "./user-post";
import CommentItem from "./commentItem";
import { UserContext } from "@/context/user-context";
import { useNavigate } from "react-router-dom";
import { getPostsById } from "@/repository/PostsRepository";
import {
  createComment,
  listCommentsByPostId,
} from "@/repository/comment-repository";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "./ui/separator";

const DetailPost = ({
  post,
  onUpdateShare,
  onEditPost,
}: {
  post: Post;
  onUpdateShare?: () => void;
  onEditPost?: () => void;
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [newPost, setNewPost] = useState(post);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchComments();
    fetchPost();
  }, [post._id, onUpdateShare]);

  const fetchComments = async () => {
    try {
      const response = await listCommentsByPostId(post._id);
      setComments(response?.data || []);
    } catch (err) {
      console.error(err);
      setComments([]);
    }
  };

  const fetchPost = async () => {
    try {
      const data = await getPostsById(post._id);
      setNewPost(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleNewPost = async () => {
    fetchPost();
  };
  const handleReplyComment = () => {
    fetchComments();
  };
  const handleDeleteComment = () => {
    fetchComments();
  };
  const handleUpdateComment = () => {
    fetchComments();
  };

  const buildCommentTree = (comments: Comment[]) => {
    const commentMap: { [key: string]: Comment[] } = {};
    const rootComments: Comment[] = [];

    comments.forEach((comment) => {
      if (comment.replyTo) {
        if (!commentMap[comment.replyTo]) {
          commentMap[comment.replyTo] = [];
        }
        commentMap[comment.replyTo].push(comment);
      } else {
        rootComments.push(comment);
      }
    });
    const addReplies = (comment: Comment) => {
      if (commentMap[comment._id]) {
        commentMap[comment._id].forEach(addReplies);
      }
    };

    rootComments.forEach(addReplies);
    return rootComments;
  };

  const commentTree = buildCommentTree(comments);

  return (
    <ScrollArea className="h-screen max-w-3xl mx-auto p-4 rounded-2xl  mt-2">
      <div className="space-y-4 py-4 max-w-2xl mx-auto">
        <UserPost
          post={newPost}
          showEditPost={user?._id === post.author._id}
          onEditPost={onEditPost}
          onUpdateShare={onUpdateShare}
          onUpdateLike={handleNewPost}
        />
        <Separator />
        {commentTree.map((comment) => (
          <div className="p-2 border border-gray-200 bg-white rounded-lg">
            <CommentItem
              key={comment._id}
              comment={comment}
              allComments={comments}
              onReply={handleReplyComment}
              onDeleteComment={handleDeleteComment}
              onUpdateComment={handleUpdateComment}
            />
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default DetailPost;
