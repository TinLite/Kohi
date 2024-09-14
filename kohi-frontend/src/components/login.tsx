import { useRef, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { login } from "@/repository/authentication-repository";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader } from "./ui/alert-dialog";

const LoginSheet = ({ children }: { children: React.ReactNode }) => {
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
      // setErrorMessage("Đăng nhập thành công");
      // setOpenAlert(true);
    } catch (e) {
      setErrorMessage("Đăng nhập thất bại. Hãy kiểm tra lại tài khoản và mật khẩu.");
      setOpenAlert(true);
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <>
      <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>Không thể đăng nhập</AlertDialogHeader>
          <AlertDialogDescription>
            {errorMessage}
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogAction>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
                <Input
                  ref={accountRef}
                  type="text"
                  placeholder="Nhập tài khoản"
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
            <Button type="submit" onClick={submitHandler} disabled={submitting}>Đăng nhập</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default LoginSheet;
