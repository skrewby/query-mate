import { createBrowserRouter, RouterProvider } from 'react-router'
import { ThemeProvider } from './components/ThemeProvider';
import Builder from './routes/Builder';
import MainLayout from './layouts/MainLayout';

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Builder />
      },
    ],
  },
]);

function App() {
  return (
    <>
      <ThemeProvider defaultTheme='system' storageKey='vite-ui-theme'>
        <RouterProvider router={router} />
      </ThemeProvider>
    </>
  )
}

export default App
