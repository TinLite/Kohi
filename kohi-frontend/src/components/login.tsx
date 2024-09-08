import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";

const LoginSheet = ({ children }: { children?: any }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="w-full mx-auto justify-center items-center">
        <SheetHeader>
          <SheetTitle>Đăng nhập</SheetTitle>
          <SheetDescription>Đăng nhập để bày tỏ ý kiến của bạn</SheetDescription>
        </SheetHeader>
        <div className="w-full grid gap-4 py-4">
          <div>
            <Label>
              Tài khoản:
              <Input type="text" id="username" placeholder="Nhập tài khoản" />
            </Label>
          </div>
          <div>
            <Label>
              Mật khẩu:
              <Input
                type="password"
                id="password"
                placeholder="Nhập mật khẩu"
              />
            </Label>
          </div>
        </div>
        <SheetFooter>
          <Button type="submit">Đăng nhập</Button>
        </SheetFooter>
        <div className="flex items-center justify-between">
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default LoginSheet;
