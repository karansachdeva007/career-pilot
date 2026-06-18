"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { DashboardSidebar } from "./dashboard-sidebar";

export function MobileSidebar({ user }: { user: any }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close the sheet whenever the pathname changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button variant="outline" size="icon" className="md:hidden shrink-0" />}>
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle navigation menu</span>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0 flex flex-col">
        <DashboardSidebar user={user} />
      </SheetContent>
    </Sheet>
  );
}
