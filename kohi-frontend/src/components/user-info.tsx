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
}: {
  user: User;
  isFollowed?: boolean;
  onFollowChange?:boolean;
}) => {
  const [isFollowing, setIsFollowing] = useState(isFollowed);
  const [following, setFollowing] = useState<User[]>([]);
  const handleFollow = async () => {
    try {
      await followUser(user._id).then((res) => {
        console.log(res);
        if(res )
        setIsFollowing(true);
      }
      );
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
          <div className="font-bold">{user.username ?? user.displayName}</div>
          <div className="text-muted-foreground text-sm">
            @{user.displayName}
          </div>
        </div>
        {isFollowed ? (
          <Button
            onClick={handleUnfollow}
            variant="outline"
            className="ml-auto"
          >
            Unfollow
          </Button>
        ) : (
          <Button onClick={handleFollow} variant="default" className="ml-auto">
            Follow
          </Button>
        )}
      </div>
    </Card>
  );
};
export default UserInfo;
