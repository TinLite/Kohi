import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ThemeProvider } from './components/theme-provider.tsx'
import './index.css'
import MainLayout from './layout/main-layout.tsx'
import PostList from './routes/posts/post-list.tsx'
import SearchUI from './components/search.tsx'
import MessagePage from './routes/messages/message.tsx'
import BookMarkUI from './components/bookmark.tsx'
import { getProfile } from './repository/user-repository.ts'
import { UserProvider } from './context/user-context.tsx'
import { User } from './types/user-type.ts'
import UserProfile from './components/user-profile.tsx'

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
    ],
  },
]);

let userData: User | undefined;

getProfile()
  .then((user) => (userData = user))
  .finally(async () => {
    createRoot(document.getElementById("root")!).render(
      <StrictMode>
        <UserProvider userData={userData}>
          <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <RouterProvider router={router} />
          </ThemeProvider>
        </UserProvider>
      </StrictMode>
    );
  });
