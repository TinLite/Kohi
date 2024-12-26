import "@/App.css";
import BookMarkUI from "@/components/bookmark";
import SearchUI from "@/components/search";
import { ThemeProvider } from "@/components/theme-provider";
import UserProfile from "@/components/user-profile";
import { UserProvider } from "@/context/user-context";
import MainLayout from "@/layout/main-layout";
import PostList from "@/routes/posts/post-list";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import PostPage from "./components/post-detail";
import ProfileFriend from "./components/profile-friend";
import { Toaster } from "./components/ui/sonner";
import { useMediaQuery } from "./hooks/use-media-query";
import "./index.css";
import { LayoutSetting } from "./layout/setting-layout";
import MessageLayout from "./layout/sub-layouts/message-layout";
import Login from "./routes/auth/login";
import Register from "./routes/auth/register";
import MessageViewDefault from "./routes/messages/message-default";
import MessageViewNewChat from "./routes/messages/message-new";
import { PageMessageChannel } from "./routes/messages/message-view";
import { PageSettingApp } from "./routes/settings/SettingApp";
import { PageSettingPassword } from "./routes/settings/SettingPassword";
import { PageSettingUser } from "./routes/settings/SettingUser";

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
    path: "/",
    element: <MainLayout disableNavOnPhone />,
    children: [
      // {
      //   path: "/message/:channelID",
      //   element: <MessagePage />,
      // },
      {
        path: "/message/",
        element: <MessageLayout />,
        children: [
          {
            index: true,
            element: <MessageViewDefault />,
          },
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
    path: 'settings',
    element: <LayoutSetting />,
    children: [
      {
        index: true,
        element: <PageSettingUser />
      },
      {
        path: 'password',
        element: <PageSettingPassword />
      },
      {
        path: 'app',
        element: <PageSettingApp />
      }
    ]
  }
]);

function App() {
  const isWideScreen = useMediaQuery("(min-width: 768px");

  return (
    <UserProvider>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
        <Toaster
          closeButton
          position={isWideScreen ? "bottom-right" : "top-center"}
        />
      </ThemeProvider>
    </UserProvider>
  );
}
export default App;
