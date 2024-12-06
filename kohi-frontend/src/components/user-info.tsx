import { User } from "@/types/user-type";
import { Card } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import {
  followUser,
  getFollowing,
  unFollowUser,
} from "@/repository/user-repository";

const UserInfo = ({
  user,
  isFollowed,
  onFollowClick,
}: {
  user: User;
  isFollowed?: boolean;
  onFollowClick?: () => void;
}) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [following, setFollowing] = useState<User[]>([]);
  const handleFollow = async () => {
    try {
      await followUser(user._id);
      setIsFollowing(true);
    } catch (err) {
      console.log(err);
    }
  };
  const handleUnfollow = async () => {
    try {
      console.log("Unfollow");
      await unFollowUser(user._id);
      setIsFollowing(false);
    } catch (err) {
      console.log(err);
    }
  };
  const fetchFollowing = async () => {
    getFollowing().then((res) => setFollowing(res.data));
  };
  useEffect(() => {
    fetchFollowing();
  }, []);

  return (
    <Card>
      <div className="flex px-6 py-4 flex-row gap-4 items-center w-full">
        <Avatar className="w-8 h-8">
          <AvatarImage
            src={user.avatar}
            className="rounded-full"
            alt="@shadcn"
          />
          <AvatarFallback>{user.username[0]}</AvatarFallback>
        </Avatar>
        <div>
          <div className="font-bold">{user.displayName ?? user.username}</div>
          <div className="text-muted-foreground text-sm">
            @{user.displayName}
          </div>
        </div>
        <Button
          onClick={isFollowing ? handleUnfollow : handleFollow}
          variant={isFollowing ? "outline" : "default"}
          className="ml-auto"
        >
          {isFollowing ? "Unfollow" : "Follow"}
        </Button>
      </div>
    </Card>
  );
};
export default UserInfo;
