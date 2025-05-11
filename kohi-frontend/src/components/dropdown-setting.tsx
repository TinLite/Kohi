import {
  IdCard,
  LogOut,
  MonitorSmartphone,
  Moon,
  Palette,
  Shield,
  Sun,
} from "lucide-react";

import { useTheme } from "@/components/theme-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserContext } from "@/context/user-context";
import { logout } from "@/repository/authentication-repository";
import { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { DialogAlertLogout } from "./dialog/dialog-alert-logout";

export function DropdownSetting({ children }: { children: React.ReactNode }) {
  const { setTheme } = useTheme();
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);

  const [alertOpen, setAlertOpen] = useState(false);

  function performLogout() {
    logout();
    setAlertOpen(false);
    navigate("/");
    setUser(null);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-54">
        {/* <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator /> */}
        {user?.roles?.includes("admin") && (
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => navigate("/admin")}>
              <Shield className="mr-2 h-4 w-4" />
              <span>Admin</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        )}
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => navigate("/settings")}>
            <IdCard className="mr-2 h-4 w-4" />
            <span>Cài đặt tài khoản</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        {/* <DropdownMenuSeparator /> */}
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Palette className="mr-2 h-4 w-4" />
              <span>Giao diện</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  <MonitorSmartphone className="mr-2 h-4 w-4" />
                  <span>Theo hệ thống</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  <Sun className="mr-2 h-4 w-4" />
                  <span>Sáng</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  <Moon className="mr-2 h-4 w-4" />
                  <span>Tối</span>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled={user == null}
          onClick={() => setAlertOpen(true)}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Đăng xuất</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
      <DialogAlertLogout
        open={alertOpen}
        onOpenChange={setAlertOpen}
        onConfirm={performLogout}
      />
    </DropdownMenu>
  );
}
