import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { NavbarLink } from "@/interfaces/NavbarLink";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "react-router-dom";
import { useState } from "react";

interface MobileNavbarLinksProps extends React.HTMLAttributes<HTMLElement> {
  links: NavbarLink[],
}

const NavbarMobile: React.FC<MobileNavbarLinksProps> = ({links, className, ...props}) => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>
        <Button variant="outline" size="icon" className={className} {...props}>
          <Menu className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Open mobile navbar</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-8">
        <h1 className="text-xl font-bold tracking-tight">TicketViewer</h1>
        <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-3">
          <div className="flex flex-col space-y-3">
            {links.map((link) => 
              <Link
                key={link.id}
                to={link.href}
                onClick={() => setOpen(false)}
                className="text-md font-medium transition-colors hover:text-primary">
                  {link.label} 
              </Link>  
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

export default NavbarMobile
