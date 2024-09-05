import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

const LoginSheet = () => {
  return (
    <Sheet>
      <SheetTrigger >
        <Button variant="ghost" className=" text-md font-bold pl-1">Login</Button>
      </SheetTrigger>
      <SheetContent className="w-full mx-auto justify-center items-center">
        <div className="w-full max-w-sm mt-6">
          <h2 className="text-xl font-semibold mb-4  text-center">Login</h2>
          <form action="" className="space-y-4 ">
            <div>
              <Label htmlFor="username">Tài khoản:</Label>
              <Input type="text" id="username" placeholder="Nhập tài khoản" />
            </div>
            <div>
              <Label htmlFor="password">Mật khẩu:</Label>
              <Input
                type="password"
                id="password"
                placeholder="Nhập mật khẩu"
              />
            </div>
            <div className="flex items-center justify-between">
              <Button type="submit">Đăng nhập</Button>
            </div>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default LoginSheet;
