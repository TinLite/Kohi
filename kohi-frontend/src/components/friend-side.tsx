import { getFriends } from '@/repository/user-repository';
import { User } from '@/types/user-type';
import { useEffect, useState } from 'react';
import { ScrollArea } from './ui/scroll-area';
import UserInfo from './user-info';
const FriendSide = () => {

  const [friendList, setFriendList] = useState<User[]>([]);

  useEffect(() => {
    getFriends().then(setFriendList)
  }, []);

  return (
    <div className="sticky h-dvh w-full max-w-xs top-0 flex-shrink-0 mr-4 hidden xl:block">
      <ScrollArea className='max-h-dvh'>
        <div className="">
          <h2 className="text-lg font-semibold my-4">Friend</h2>
          <div className=''>
            {friendList.map((friend) => (
              <UserInfo user={friend} key={friend._id} />
            ))}
            {
              friendList.length === 0 && (
                <div className="text-muted-foreground">
                  When you and your friend follow each other,<br/>
                  their account will appear here :D<br/>
                  For now, no one has followed you back yet~<br/>
                  But worry not, let's follow them first!<br/>
                </div>
              )
            }
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
export default FriendSide;
