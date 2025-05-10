import "@/App.css";
import BookMarkUI from "@/components/bookmark";
import PostPage from "@/components/post-detail";
import ProfileFriend from "@/components/profile-friend";
import SearchUI from "@/components/search";
import { ThemeProvider } from "@/components/theme-provider";
import UserProfile from "@/components/user-profile";
import { UserContext } from "@/context/user-context";
import "@/index.css";
import MainLayout from "@/layout/main-layout";
import { LayoutSetting } from "@/layout/setting-layout";
import MessageLayout from "@/layout/sub-layouts/message-layout";
import ForgotPassword from "@/routes/auth/forgotpassword";
import Login from "@/routes/auth/login";
import Register from "@/routes/auth/register";
import { PageCall } from "@/routes/call/call";
import MessageViewDefault from "@/routes/messages/message-default";
import MessageViewNewChat from "@/routes/messages/message-new";
import { PageMessageChannel } from "@/routes/messages/message-view";
import PostList from "@/routes/posts/post-list";
import { PageSettingApp } from "@/routes/settings/SettingApp";
import { PageSettingPassword } from "@/routes/settings/SettingPassword";
import { PageSettingUser } from "@/routes/settings/SettingUser";
import { useContext } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AdminComments from "./components/admin/comments";
import AdminPosts from "./components/admin/posts";
import AdminUsers from "./components/admin/users";
import AdminLayout from "./layout/admin-layout/admin-layout";
import LayoutSystem from "./layout/system-layout";
import DetailUser from "./components/admin/detailuser";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <PostList />,
      },
      {
        path: "/search",
        element: <SearchUI />,
      },
      {
        path: "/bookmark",
        element: <BookMarkUI />,
      },
      {
        path: "/profile",
        children: [
          {
            index: true,
            element: <UserProfile />,
          },
          {
            path: ":id",
            element: <ProfileFriend />,
          },
        ],
      },
      {
        path: "/post/detail/:id",
        element: <PostPage />,
      },
      {
        path: "/message/",
        element: <MessageLayout />,
        children: [
          {
            index: true,
            element: <MessageViewDefault />,
          },
        ],
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/",
    element: <MainLayout disableNavOnPhone />,
    children: [
      {
        path: "/message/",
        element: <MessageLayout />,
        children: [
          {
            path: "new",
            element: <MessageViewNewChat />,
          },
          {
            path: ":channelID",
            element: <PageMessageChannel />,
          },
        ],
      },
    ],
  },
  {
    path: "settings",
    element: <LayoutSetting />,
    children: [
      {
        index: true,
        element: <PageSettingUser />,
      },
      {
        path: "password",
        element: <PageSettingPassword />,
      },
      {
        path: "app",
        element: <PageSettingApp />,
      },
    ],
  },
  {
    path: "/call/:callId",
    element: <PageCall />,
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <AdminUsers />,
      },
      {
        path: "/admin/users",
        element: <AdminUsers />,
      },
      {
        path: "/admin/posts",
        element: <AdminPosts />,
      },
      {
        path: "/admin/comments",
        element: <AdminComments />,
      },
      {
        path: "/admin/users/detail/:id",
        element: <DetailUser />,
      },
    ],
  },
]);

function App() {
  const { isAuthenticating } = useContext(UserContext);
  // useEffect(() => {
  // }, []);
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      {
        isAuthenticating ? (
          <div className="flex h-screen w-screen items-center justify-center bg-background text-foreground"></div>
        ) : (
          <>
            <LayoutSystem>
              <RouterProvider router={router} />
            </LayoutSystem>
          </>
        )
      }
    </ThemeProvider>
  );
}
export default App;
