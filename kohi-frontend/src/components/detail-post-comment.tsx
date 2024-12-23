import { Post } from "@/types/post-type";
import UserPost from "./user-post";
import { Comment } from "@/types/comment-type";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import {
  createComment,
  listCommentsByPostId,
} from "@/repository/comment-repository";
import { ScrollArea } from "@/components/ui/scroll-area";
import CommentItem from "./commentItem";
const DetailPost = ({ post }: { post: any }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  const fetchComments = async () => {
    try {
      const response = await listCommentsByPostId(post._id);
      if (response && response.data) {
        setComments(response.data);
      } else {
        setComments([]);
      }
    } catch (err) {
      console.error(err);
      setComments([]);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [post._id]);

  const handleCreateComment = async () => {
    if (!newComment.trim()) return;
    try {
      await createComment(post._id, newComment);
      setNewComment("");
      fetchComments();
    } catch (err) {
      console.error(err);
    }
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
    <ScrollArea className="h-screen">
      <div className="space-y-6 py-6 max-w-2xl mx-auto">
        <UserPost post={post} />
        {commentTree.map((comment) => (
          <CommentItem
            key={comment._id}
            comment={comment}
            allComments={comments}
          />
        ))}
      </div>
    </ScrollArea>
  );
};

export default DetailPost;
