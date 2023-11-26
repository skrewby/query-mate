import { Toaster } from "@/components/ui/toaster"
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import MainLayout from "@/layouts/MainLayout";

import Builder from "@/routes/Builder"
import Formatter from "./routes/Formatter";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Builder />,
      },
      {
        path: "/format",
        element: <Formatter />,
      },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  )
}

export default App
