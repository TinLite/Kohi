import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-dropdown-menu";

export default function Register() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <CardHeader>
          <CardTitle className="text-gray-700">Đăng ký</CardTitle>
        </CardHeader>
        <CardContent>
        <div>
            <Label
              //   htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </Label>
            <Input
              id="username"
              type="text"
              // value={username}
              // onChange={(e) => set(e.target.value)}
              required
              className="mt-1 block w-full text-black"
            />
          </div>
          <div>
            <Label
              //   htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </Label>
            <Input
              id="email"
              type="email"
              // value={email}
              // onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full text-black"
            />
          </div>
          <div>
            <Label
              //   htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Mật khẩu
            </Label>
            <Input
              id="password"
              type="password"
              // value={password}
              // onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full text-black"
            />
          </div>
          <div>
            <Label
              //   htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Xác nhận mật khẩu
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              // value={confirmPassword}
              // onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="mt-1 block w-full text-black"
            />
          </div>
          <div className="py-4">
            <Button type="submit" className="w-full">
              Đăng ký
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
