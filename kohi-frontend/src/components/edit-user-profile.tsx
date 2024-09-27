import { Button } from "./ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogClose } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export default function EditProfileDialog() {
  return (
    <Dialog>
      <DialogTrigger>
        <Button className="px-4 py-2 bg-blue-600 text-white rounded-md">Edit Profile </Button>
      </DialogTrigger>
      <DialogContent className="p-0 bg-gray-900 text-white rounded-lg max-w-md mx-auto overflow-hidden">
        <div className="relative">
          {/* Wall Image - Ảnh nền mặc định */}
          <div className="h-32 bg-gray-700">
            <img
              src="/default-wall.png"  // Thay đổi đường dẫn này với ảnh nền mặc định
              alt="Wall"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Avatar - Ảnh đại diện mặc định */}
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2">
            <label htmlFor="avatar" className="relative cursor-pointer">
              <img
                src="/default-avatar.png" // Thay đổi đường dẫn này với ảnh avatar mặc định
                alt="Avatar"
                className="w-20 h-20 rounded-full border-4 border-gray-900 object-cover"
              />
            </label>
          </div>
        </div>

        {/* Form fields */}
        <div className="p-6 space-y-4 mt-12">
          {/* Username */}
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm">Username</label>
            <Input
              type="text"
              id="username"
              placeholder="Enter your username"
              className="w-full p-2 rounded-lg bg-gray-800 border border-gray-600 text-white"
            />
          </div>

          {/* Display Name */}
          <div className="space-y-2">
            <Label htmlFor="displayName" className="text-sm">Display Name</Label>
            <Input
              type="text"
              id="displayName"
              placeholder="Enter display name"
              className="w-full p-2 rounded-lg bg-gray-800 border border-gray-600 text-white"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm">Email</Label>
            <Input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="w-full p-2 rounded-lg bg-gray-800 border border-gray-600 text-white"
            />
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio" className="text-sm">Bio</Label>
            <textarea
              id="bio"
              placeholder="Write something about yourself"
              className="w-full p-2 rounded-lg bg-gray-800 border border-gray-600 text-white"
            ></textarea>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end space-x-4 p-6">
          <Button className="px-4 py-2 bg-green-600 text-white rounded-md">Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
