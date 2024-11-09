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
]);

function App() {
  const isWideScreen = useMediaQuery('(min-width: 768px');

  return (
    <UserProvider>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
        <Toaster closeButton position={(isWideScreen ? "bottom-right" : "top-center")} />
      </ThemeProvider>
    </UserProvider>
  );
}
export default App;
