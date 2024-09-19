import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ThemeProvider } from './components/theme-provider.tsx'
import './index.css'
import MainLayout from './layout/main-layout.tsx'
import { getUserId } from './repository/authentication-repository.ts'
import PostList from './routes/posts/post-list.tsx'
import SearchUI from './components/search.tsx'
import BookMarkUI from './components/bookmark.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <PostList />
      }
    ]
  },
  {
    path: '/search',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <SearchUI />
      }
    ]
  },
  {
    path: '/bookmark',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <BookMarkUI />
      }
    ]
  }

])

getUserId().then((id) => {
  localStorage.user_id = id;
}).finally(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
      </ThemeProvider>
    </StrictMode>,
  )
})


