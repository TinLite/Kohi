import { useContext, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { getUserId, login } from "@/repository/authentication-repository";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
} from "./ui/alert-dialog";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { UserContext } from "@/context/user-context";
import { getProfile } from "@/repository/user-repository";

const LoginSheet = ({ children }: { children: React.ReactNode }) => {
  const { user, setUser } = useContext(UserContext);

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [openAlert, setOpenAlert] = useState(false);

  const accountRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const submitHandler = async () => {
    setSubmitting(true);
    const account = accountRef.current?.value;
    const password = passwordRef.current?.value;
    passwordRef.current!.value = "";
    // if (errorMessage !== "") {
    //   setErrorMessage("");
    // }
    if (!account || !password) {
      setErrorMessage("Vui lòng điền đầy đủ thông tin");
      setOpenAlert(true);
      setSubmitting(false);
      return;
    }
    try {
      await login(account, password);
      if (localStorage.backend_access_token) {
        const userId = await getUserId();
        setUser(await getProfile(userId));
        setOpenAlert(false);
      }
    } catch (e) {
      setErrorMessage(
        "Đăng nhập thất bại. Hãy kiểm tra lại tài khoản và mật khẩu."
      );
      setOpenAlert(true);
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <>
      <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>Không thể đăng nhập</AlertDialogHeader>
          <AlertDialogDescription>{errorMessage}</AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogAction>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Sheet>
        <SheetTrigger asChild>{children}</SheetTrigger>
        <SheetContent className="w-full mx-auto justify-center items-center">
          <Tabs defaultValue="login" className="pt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Đăng nhập</TabsTrigger>
              <TabsTrigger value="signup">Đăng ký</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <SheetHeader className="mt-4">
                <SheetTitle>Đăng nhập</SheetTitle>
                <SheetDescription>
                  Đăng nhập để bày tỏ ý kiến của bạn
                </SheetDescription>
              </SheetHeader>
              <div className="w-full grid gap-4 py-4">
                <div>
                  <Label>
                    Email:
                    <Input
                      ref={accountRef}
                      type="text"
                      placeholder="m@example.com"
                    />
                  </Label>
                </div>
                <div>
                  <Label>
                    Mật khẩu:
                    <Input
                      ref={passwordRef}
                      type="password"
                      placeholder="Nhập mật khẩu"
                    />
                  </Label>
                </div>
              </div>
              <SheetFooter>
                <Button
                  type="submit"
                  onClick={submitHandler}
                  disabled={submitting}
                >
                  Đăng nhập
                </Button>
              </SheetFooter>
            </TabsContent>
            <TabsContent value="signup">
              <SheetHeader className="mt-4">
                <SheetTitle>Đăng ký</SheetTitle>
                <SheetDescription>
                  Đăng ký tài khoản nếu bạn chưa có
                </SheetDescription>
              </SheetHeader>
              <div className="w-full grid gap-4 py-4">
                <div>
                  <Label>
                    Họ và tên:
                    <Input
                      ref={accountRef}
                      type="text"
                      placeholder="Nhập họ và tên "
                    />
                  </Label>
                </div>
                <div>
                  <Label>
                    Nhập email:
                    <Input
                      ref={accountRef}
                      type="text"
                      placeholder="Nhập email dùng để đăng nhập"
                    />
                  </Label>
                </div>
                <div>
                  <Label>
                    Mật khẩu:
                    <Input
                      ref={passwordRef}
                      type="password"
                      placeholder="Nhập mật khẩu"
                    />
                  </Label>
                </div>
                <div>
                  <Label>
                    Xác nhận mật khẩu:
                    <Input
                      ref={passwordRef}
                      type="password"
                      placeholder="Nhập mật khẩu xác nhận"
                    />
                  </Label>
                </div>
              </div>
              <SheetFooter>
                <Button
                  type="submit"
                  onClick={submitHandler}
                  disabled={submitting}
                >
                  Đăng ký
                </Button>
              </SheetFooter>
            </TabsContent>
          </Tabs>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default LoginSheet;
