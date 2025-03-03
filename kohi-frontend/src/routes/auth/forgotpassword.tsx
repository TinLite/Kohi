import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { UserContext } from "@/context/user-context";
import {
  logout,
  resetPassword,
  verifyCode,
  verifyEmail,
} from "@/repository/authentication-repository";
import { log } from "console";
import { useContext, useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function ForgotPassword() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const backgrounds = [
    "cole-keister-UP3pjHKx0ts-unsplash.jpg",
    "hai-tran-GFeIKOJNPJY-unsplash.jpg",
    "kashish-grover-atssyEsdrSk-unsplash.jpg",
    "steffen-bertram-qDZ-Xd8dX6w-unsplash.jpg",
  ];
  const [background, setBackground] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
  const [isOtpValid, setIsOtpValid] = useState<boolean>(false);
  const [newPassword, setNewPassword] = useState<string>("");
  const [retypePassword, setRetypePassword] = useState<string>("");
  const handleEmailSubmit = async () => {
    verifyEmail(email)
      .then(() => {
        toast.success("OTP has been sent to your email", { duration: 2000 });
        setIsOtpSent(true);
      })
      .catch((e) => {
        const mess = "Email does not exist";
        toast.error(mess || e.message, { duration: 2000 });
      });
  };
  const handleOtpSubmit = async () => {
    verifyCode(email, otp)
      .then(() => {
        toast.success("OTP verified successfully", { duration: 2000 });
        setIsOtpValid(true);
      })
      .catch(() => {
        toast.error("Invalid OTP", { duration: 2000 });
      });
  };
  const handlePasswordSubmit = async () => {
    if (newPassword !== retypePassword) {
      toast.error("New passwords do not match", { duration: 2000 });
      return;
    }
    await resetPassword(email, newPassword)
      .then(() => {
        toast.success("Password updated successfully", { duration: 2000 });
        navigate("/Login");
      })
      .catch((error) => {
        toast.error(error.message, { duration: 2000 });
      });
  };
  useEffect(() => {
    setBackground(backgrounds[Math.floor(Math.random() * backgrounds.length)]);
    if (user) {
      logout().then(() => {
        setUser(null);
      });
    }
  }, [user, setUser]);

  return (
    <div className="flex h-screen w-screen">
      <div className="h-screen flePx-grow md:grid hidden relative">
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
        {/* <h1 className="text-3xl font-bold mb-4">
          コー
          <br />
          ヒー
        </h1> */}
        <div className="w-full max-w-xs">
          <h1 className="text-xl font-bold text-center">Welcome to Kohi.</h1>
          {!isOtpSent ? (
            <>
              <div className="text-center text-sm">
                Please, enter your email to change password.
              </div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="kohi@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button
                type="button"
                className="w-full mt-4"
                onClick={handleEmailSubmit}
              >
                VERIFY
              </Button>
            </>
          ) : !isOtpValid ? (
            <>
              <div className="text-center text-sm">
                Please check your email and enter your OTP to change password.
              </div>
              <InputOTP value={otp} onChange={setOtp} maxLength={6}>
                <InputOTPGroup className="mt-4 mx-auto">
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              <Button
                type="button"
                className="w-full mt-4"
                onClick={handleOtpSubmit}
              >
                VERIFY OTP
              </Button>
            </>
          ) : (
            <>
              <div className="text-center text-sm">
                Please, enter a new password to change password
              </div>
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="Your new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <Label htmlFor="retype-password">Retype New Password</Label>
              <Input
                id="retype-password"
                type="password"
                placeholder="Retype your new password"
                value={retypePassword}
                onChange={(e) => setRetypePassword(e.target.value)}
                required
              />
              <Button
                type="button"
                className="w-full mt-4"
                onClick={handlePasswordSubmit}
              >
                CHANGE PASSWORD
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
