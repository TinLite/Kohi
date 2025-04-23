import { UserContext } from "@/context/user-context";
import {
  getUserId,
  login,
  loginGoogle,
  register,
} from "@/repository/authentication-repository";
import { getProfile } from "@/repository/user-repository";
import { TabsContent } from "@radix-ui/react-tabs";
import { useContext, useRef, useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
} from "./ui/alert-dialog";
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
} from "./ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { Link, useNavigate } from "react-router-dom";
import Google, { GoogleMap } from "./icons/Google";
import Discord from "./icons/Discord";
import { Separator } from "./ui/separator";
import PiCoin from "./icons/PiCoin";

const LoginSheet = ({
  open,
  onOpenChange,
}: {
  open?: boolean;
  onOpenChange?: () => void;
}) => {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [openAlert, setOpenAlert] = useState(false);

  const accountRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const emailRef = useRef<HTMLInputElement>(null);
  const repeatPasswordRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState("login");

  const loginSubmitHandler = async () => {
    setSubmitting(true);
    const account = accountRef.current?.value;
    const password = passwordRef.current?.value;
    passwordRef.current!.value = "";
    // if (errorMessage !== "") {
    //   setErrorMessage("");
    // }
    if (!account || !password) {
      setErrorMessage("Please fill in all fields");
      setOpenAlert(true);
      setSubmitting(false);
      return;
    }
    try {
      await login(account, password);
      const userId = await getUserId();
      setUser(await getProfile(userId));
      setOpenAlert(false);
      onOpenChange?.();
    } catch (e) {
      setErrorMessage("Failed to login. Please check your information.");
      setOpenAlert(true);
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const reigsterSubmitHandler = async () => {
    setSubmitting(true);
    const username = accountRef.current?.value;
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;
    const repeatPassword = repeatPasswordRef.current?.value;
    passwordRef.current!.value = "";
    repeatPasswordRef.current!.value = "";
    if (!username || !email || !password || !repeatPassword) {
      setErrorMessage("Please fill in all fields");
      setOpenAlert(true);
      setSubmitting(false);
      return;
    }
    if (password !== repeatPassword) {
      setErrorMessage("Retypted password does not match");
      setOpenAlert(true);
      setSubmitting(false);
      return;
    }
    try {
      await register({ username, email, password });
      toast.success("Register successfully. Please login to continue.");
      setActiveTab("login");
    } catch (e) {
      setErrorMessage("Failed to register. Please check your information.");
      setOpenAlert(true);
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };
  const loginGoogleHandler = async () => {
    await loginGoogle();
  };
  return (
    <>
      <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>Unable to login</AlertDialogHeader>
          <AlertDialogDescription>{errorMessage}</AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogAction>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="left"
          className="w-full mx-auto justify-center items-center"
        >
          <Tabs
            defaultValue="login"
            className="pt-4"
            onValueChange={(value) => setActiveTab(value)}
            value={activeTab}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Register</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <SheetHeader className="mt-4">
                <SheetTitle>Login</SheetTitle>
                {/* <SheetDescription></SheetDescription> */}
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
                    Password:
                    <Input
                      ref={passwordRef}
                      type="password"
                      placeholder="Type your password"
                    />
                  </Label>
                </div>
              </div>
              <div className="text-muted-foreground">
                <p>
                  <Link to="/forgot-password" className="hover:underline">
                    Forgot password?
                  </Link>
                </p>
              </div>
              <SheetFooter>
                <Button
                  type="submit"
                  onClick={loginSubmitHandler}
                  disabled={submitting}
                >
                  Login
                </Button>
              </SheetFooter>
              <Separator className="my-4" />
              <div className="flex flex-col gap-2">
                <Button onClick={loginGoogleHandler} variant="outline">
                  <Google />
                  <span className="ml-2">Login with Google</span>
                </Button>
                <Button variant="outline">
                  <Discord className="w-5 h-5" fill="currentColor" />
                  <span className="ml-2">Login with Discord</span>
                </Button>
                <Button variant="outline">
                  <GoogleMap className="w-5 h-5" fill="currentColor" />
                  <span className="ml-2">Login with Google Maps</span>
                </Button>
                <Button variant="outline">
                  <PiCoin className="w-5 h-5" fill="currentColor" />
                  <span className="ml-2">Login with Pi Network</span>
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="signup">
              <SheetHeader className="mt-4">
                <SheetTitle>Register new account</SheetTitle>
                <SheetDescription>Let's create a new account</SheetDescription>
              </SheetHeader>
              <div className="w-full grid gap-4 py-4">
                <div>
                  <Label>
                    Username:
                    <Input ref={accountRef} type="text" placeholder="HuTao" />
                  </Label>
                </div>
                <div>
                  <Label>
                    Email:
                    <Input
                      ref={emailRef}
                      type="text"
                      placeholder="contact@wangsheng-funeral-parlor.genimp"
                    />
                  </Label>
                </div>
                <div>
                  <Label>
                    Password:
                    <Input
                      ref={passwordRef}
                      type="password"
                      placeholder="Your secret password"
                    />
                  </Label>
                </div>
                <div>
                  <Label>
                    Repeat password:
                    <Input
                      ref={repeatPasswordRef}
                      type="password"
                      placeholder="Must be the same as above"
                    />
                  </Label>
                </div>
              </div>
              <SheetFooter>
                <Button
                  type="submit"
                  onClick={reigsterSubmitHandler}
                  disabled={submitting}
                >
                  Register
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
