import { ModeToggle } from "@/components/mode-toggle";
import NavbarLinks from "./navbar-links";
import NavbarMobile from "./navbar-mobile";
import { NavbarLink } from "@/interfaces/NavbarLink";
import { useNavigate } from "react-router-dom";

const links: NavbarLink[] = [
  {
    id: 0,
    label: "Builder",
    href: "/"
  },
  {
    id: 1,
    label: "Formatter",
    href: "/format"
  },
  {
    id: 2,
    label: "Cheatsheet",
    href: "/cheatsheet"
  },
];

function Navbar() {
  const navigate = useNavigate();

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <h1 className="hidden md:flex text-3xl font-bold tracking-tight cursor-pointer"><a href="https://www.youtube.com/watch?v=HyWYpM_S-2c" target="_blank" rel="noreferrer">Query Mate</a></h1>
        <NavbarLinks links={links} className="hidden mx-6 md:flex"/>
        <NavbarMobile links={links} className="md:hidden mr-4"/>
        <div className="ml-auto flex items-center space-x-4">
          <div className="hidden md:flex">
            <ModeToggle />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar
