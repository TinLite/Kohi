import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Login() {
  const backgrounds = [
    "cole-keister-UP3pjHKx0ts-unsplash.jpg",
    "hai-tran-GFeIKOJNPJY-unsplash.jpg",
    "kashish-grover-atssyEsdrSk-unsplash.jpg",
    "steffen-bertram-qDZ-Xd8dX6w-unsplash.jpg",
  ]
  const [background, setBackground] = useState<string>("");
  useEffect(() => {
    setBackground(backgrounds[Math.floor(Math.random() * backgrounds.length)]);
  }, []);
  return (
    <div className="flex h-screen w-screen">
      <div className="h-screen flex-grow md:grid hidden relative">
        <img src={`/bg/${background}`} alt="background image" className="object-cover h-screen w-full brightness-75" />
        <Link to="/" className="hidden md:block absolute top-8 left-0 pl-8 bg-accent animate-in slide-in-from-left-28 border-r-8 border-primary">
          <div className="px-4 font-bold bg-background text-foreground">
            コー
            <br />
            ヒー
          </div>
        </Link>
      </div>
      <div className="flex-shrink-0 w-screen md:max-w-lg bg-muted text-accent-foreground px-4 py-8 justify-center items-center flex flex-col">
        <div className="flex flex-col w-screen max-w-sm">
          <h1 className="scroll-m-20 text-3xl font-semibold tracking-tight mb-8 text-center">
            Login to continue
          </h1>
          <div className="grid grid-cols-4 items-center gap-2">
            <Label className="text-right">Email</Label>
            <Input type="email" placeholder="hello@tinlite.com" className="col-span-3"/>
            <Label className="text-right">Password</Label>
            <Input type="password" placeholder="Your little secret password goes here" className="col-span-3"/>
            <Button className="col-span-full">Submit</Button>
            <div className="flex justify-between text-foreground col-span-full">
              <Link to="/">Back to home page</Link>
              <Link to="/register">Register</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
