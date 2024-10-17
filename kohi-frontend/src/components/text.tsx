<div className="space-y-4">
  {/* <div className="font-bold">Danh sách Comment</div> */}
  {Array.isArray(comments) && comments.length > 0 ? (
    comments.map((comment) => (
      <div key={comment._id} className="flex items-start gap-4">
        <Avatar className="w-8 h-8">
          <AvatarImage
            src="https://via.placeholder.com/150"
            className="rounded-full"
            alt={comment.author.username[0]}
          />
          <AvatarFallback>{comment.author.username[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-grow">
          <p className="text-sm font-semibold">
            {comment.author.displayName || comment.author.username}
          </p>
          <p className="text-sm">{comment.content}</p>
          <div className="flex items-center text-xs text-muted-foreground gap-2">
            <span>{comment.timeStamp?.toString()}</span>
            <CommentItem comment={comment} />
          </div>
        </div>
      </div>
    ))
  ) : (
    <p className="text-sm text-gray-500">No comments yet.</p>
  )}
</div>;
