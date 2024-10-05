import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import '@/App.css';
import BookMarkUI from '@/components/bookmark';
import SearchUI from '@/components/search';
import UserProfile from '@/components/user-profile';
import MainLayout from '@/layout/main-layout';
import MessagePage from '@/routes/messages/message';
import PostList from '@/routes/posts/post-list';
import { Toaster } from 'sonner';
import { UserProvider } from '@/context/user-context';
import './index.css'
import { ThemeProvider } from '@/components/theme-provider';

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

function App() {
    return (
        <UserProvider>
            <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
                <RouterProvider router={router} />
                <Toaster />
            </ThemeProvider>
        </UserProvider>)
}
export default App
