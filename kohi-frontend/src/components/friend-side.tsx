import UserInfo from './user-info';
const FriendSide = () => {
    const friends = {
        _id: "user1",
        username: "shadcn",
        displayName: "Shad CN",
        avatar: "https://example.com/avatar.jpg"
    }
  return (
    <div className="w-64">
      <h2 className="text-lg font-semibold mb-4">Bạn bè</h2>
      <div className=''>
      <UserInfo user={friends} />
      </div>
    </div>
  );
};
export default FriendSide;
