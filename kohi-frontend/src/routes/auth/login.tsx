import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserContext } from "@/context/user-context";
import { getUserId, login } from "@/repository/authentication-repository";
import { getProfile } from "@/repository/user-repository";
import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Login() {
  const backgrounds = [
    "cole-keister-UP3pjHKx0ts-unsplash.jpg",
    "hai-tran-GFeIKOJNPJY-unsplash.jpg",
    "kashish-grover-atssyEsdrSk-unsplash.jpg",
    "steffen-bertram-qDZ-Xd8dX6w-unsplash.jpg",
  ];
  const [background, setBackground] = useState<string>("");
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const accountRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setBackground(backgrounds[Math.floor(Math.random() * backgrounds.length)]);
  }, []);

  const loginHandle = async () => {
    const account = accountRef.current?.value;
    const password = passwordRef.current?.value;
    if (!account || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    try {
      await login(account, password);
      const userId = await getUserId();
      const userProfile = await getProfile(userId);
      setUser(userProfile);
      toast.success("Login successful");
      navigate("/");
    } catch (e) {
      toast.error("Failed to login. Please check your information.");
      console.error(e);
    }
  };

  return (
    <div className="flex h-screen w-screen">
      <div className="h-screen flex-grow md:grid hidden relative">
        <img
          src={`/bg/${background}`}
          alt="background image"
          className="object-cover h-screen w-full brightness-75"
        />
        <Link
          to="/"
          className="hidden md:block absolute top-8 left-0 pl-8 bg-accent animate-in slide-in-from-left-28 border-r-8 border-primary"
        >
          <div className="px-4 font-bold bg-background text-foreground">
            コー
            <br />
            ヒー
          </div>
        </Link>
      </div>
      <div className="flex flex-col justify-center items-center w-full md:w-1/3 p-8">
        <h1 className="text-3xl font-bold mb-4">Login</h1>
        <div className="w-full max-w-xs">
          <Label>
            Email:
            <Input ref={accountRef} type="text" placeholder="m@example.com" />
          </Label>
          <Label className="mt-4">
            Password:
            <Input
              ref={passwordRef}
              type="password"
              placeholder="Type your password"
            />
          </Label>
          <Button className="mt-4 w-full" onClick={loginHandle}>
            Login
          </Button>
          <p className="mt-4 text-center">
            Forgot password? <Link to="/forgot-password" className="text-blue-500 hover:underline">Forgot</Link>
            <br />
            Don't have an account? <Link to="/register" className="text-blue-500 hover:underline">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
