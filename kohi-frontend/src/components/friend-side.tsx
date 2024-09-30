import UserInfo from './user-info';
const FriendSide = () => {
  const friends = {
    _id: "user1",
    username: "shadcn",
    displayName: "Shad CN",
    avatar: "https://example.com/avatar.jpg"
  }
  return (
    <div className="max-w-xs w-full">
      <h2 className="text-lg font-semibold my-4">Bạn bè</h2>
      <div className=''>
        <UserInfo user={friends} />
      </div>
    </div>
  );
};
export default FriendSide;
