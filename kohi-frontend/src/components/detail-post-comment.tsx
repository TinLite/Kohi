import { UserContext } from "@/context/user-context";
import { getPostsById } from "@/repository/PostsRepository";
import { listCommentsByPostId } from "@/repository/comment-repository";
import { Comment } from "@/types/comment-type";
import { Post } from "@/types/post-type";
import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import CommentItem from "./commentItem";
import { Separator } from "./ui/separator";
import UserPost from "./user-post";

const DetailPost = ({
  post,
  onUpdateShare,
  onEditPost,
  onDeletePost = () => { },
}: {
  post: Post;
  onUpdateShare?: () => void;
  onEditPost?: () => void;
  onDeletePost?: () => void;
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newPost, setNewPost] = useState(post);
  const { user } = useContext(UserContext);
  const location = useLocation();
  const [expandedComments, setExpandedComments] = useState<string[]>([]);
  const { commentId } = (location.state as { commentId?: string }) || {};

  useEffect(() => {
    fetchComments();
    fetchPost();
  }, [post._id, onUpdateShare]);

  useEffect(() => {
    if (commentId) {
      // mở rộng reply nếu mà có comment đó là 1 comment reply
      const expandRepliesForComment = (commentId: string) => {
        comments.forEach((comment) => {
          if (comment._id === commentId && comment.replyTo) {
            setExpandedComments((prev) =>
              prev.includes(comment.replyTo!)
                ? prev
                : [...prev, comment.replyTo!]
            ); //mở rộng reply của comment cha
            expandRepliesForComment(comment.replyTo); // Đệ quy mở rộng tất cả cha
          }
        });
      };
      expandRepliesForComment(commentId);
      // trỏ đến comment
      const commentElement = document.getElementById(`comment-${commentId}`);
      if (commentElement) {
        commentElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [commentId, comments]);

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
    <div className="space-y-4 my-12 max-w-2xl mx-auto">
      <UserPost
        post={newPost}
        showEditPost={user?._id === post.author._id}
        onEditPost={onEditPost}
        onUpdateShare={onUpdateShare}
        onUpdateLike={fetchPost}
        onCommentCreate={fetchComments}
      />
      <Separator />
      {
        comments.length === 0 && (
          <div className="text-center text-muted-foreground text-sm font-semibold">
            No comments yet. Be the first to comment!
          </div>
        )
      }
      {commentTree.map((comment) => (
        <div
          id={`comment-${comment._id}`}
          key={comment._id}
          className="border bg-card rounded-lg"
        >
          <CommentItem
            comment={comment}
            allComments={comments}
            onReply={handleReplyComment}
            onDeleteComment={handleDeleteComment}
            onUpdateComment={handleUpdateComment}
            showReplies={expandedComments.includes(comment._id)} // Truyền trạng thái mở rộng
            onToggleReplies={() =>
              setExpandedComments(
                (prev) =>
                  prev.includes(comment._id)
                    ? prev.filter((id) => id !== comment._id) // Thu gọn nếu đã mở
                    : [...prev, comment._id] // Mở rộng nếu chưa mở
              )
            }
            focusedCommentId={commentId ?? ""}
          />
        </div>
      ))}
    </div>
  );
};

export default DetailPost;
