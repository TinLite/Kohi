import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "@/App.css";
import BookMarkUI from "@/components/bookmark";
import SearchUI from "@/components/search";
import UserProfile from "@/components/user-profile";
import MainLayout from "@/layout/main-layout";
import MessagePage from "@/routes/messages/message";
import PostList from "@/routes/posts/post-list";
import { UserProvider } from "@/context/user-context";
import "./index.css";
import { ThemeProvider } from "@/components/theme-provider";
import PostPage from "./components/post-detail";
import { Toaster } from "./components/ui/sonner";
import { useMediaQuery } from "./hooks/use-media-query";
import Login from "./routes/auth/login";
import Register from "./routes/auth/register";

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
        path: "/message",
        element: <MessagePage />,
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
      {
        path: "/message/:channelID",
        element: <MessagePage />,
      },
    ],
  },
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
