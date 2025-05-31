import Navbar from "@/components/navbar/Navbar"
import { Outlet } from "react-router";

function MainLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export default MainLayout
