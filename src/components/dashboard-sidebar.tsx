"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Briefcase, User as UserIcon, LogOut, BookOpen, Bot, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function DashboardSidebar({ user }: { user: any }) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/dashboard' && pathname === '/dashboard') return true;
    if (href !== '/dashboard' && pathname.startsWith(href)) return true;
    return false;
  };
  return (
    <>
      <div className="h-14 flex items-center px-6 border-b shrink-0">
        <Link href="/" className="font-bold text-lg text-primary tracking-tight">
          CareerPilot AI
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        <Link href="/dashboard">
          <Button variant={isActive("/dashboard") ? "secondary" : "ghost"} className="w-full justify-start">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
        </Link>
        <Link href="/career-copilot">
          <Button 
            variant="default" 
            className={cn(
              "w-full justify-start mt-2 mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 shadow-md relative",
              isActive("/career-copilot") ? "from-blue-700 to-indigo-700 ring-2 ring-offset-2 ring-indigo-500" : "hover:from-blue-700 hover:to-indigo-700"
            )}
          >
            <Bot className="mr-2 h-4 w-4" />
            Career Copilot
            <Star className="ml-auto h-4 w-4 fill-yellow-400 text-yellow-400" />
          </Button>
        </Link>
        <Link href="/tracker">
          <Button variant={isActive("/tracker") ? "secondary" : "ghost"} className="w-full justify-start">
            <Briefcase className="mr-2 h-4 w-4" />
            Application Tracker
          </Button>
        </Link>
        <Link href="/resume">
          <Button variant={isActive("/resume") && pathname === "/resume" ? "secondary" : "ghost"} className="w-full justify-start">
            <FileText className="mr-2 h-4 w-4" />
            Resume Analysis
          </Button>
        </Link>
        <Link href="/resume/tailor">
          <Button variant={isActive("/resume/tailor") ? "secondary" : "ghost"} className="w-full justify-start pl-8 text-sm">
            <FileText className="mr-2 h-3 w-3" />
            Tailor Resume
          </Button>
        </Link>
        <Link href="/cover-letter">
          <Button variant={isActive("/cover-letter") ? "secondary" : "ghost"} className="w-full justify-start pl-8 text-sm">
            <FileText className="mr-2 h-3 w-3" />
            Cover Letter
          </Button>
        </Link>
        <Link href="/interview-prep">
          <Button variant={isActive("/interview-prep") ? "secondary" : "ghost"} className="w-full justify-start">
            <UserIcon className="mr-2 h-4 w-4" />
            Interview Prep
          </Button>
        </Link>
        <Link href="/knowledge">
          <Button variant={isActive("/knowledge") ? "secondary" : "ghost"} className="w-full justify-start">
            <BookOpen className="mr-2 h-4 w-4" />
            Knowledge Base
          </Button>
        </Link>
        <Link href="/jobs">
          <Button variant={isActive("/jobs") ? "secondary" : "ghost"} className="w-full justify-start">
            <Briefcase className="mr-2 h-4 w-4" />
            Job Matches
          </Button>
        </Link>
        <Link href="/profile">
          <Button variant={isActive("/profile") ? "secondary" : "ghost"} className="w-full justify-start">
            <UserIcon className="mr-2 h-4 w-4" />
            Profile
          </Button>
        </Link>
      </nav>
      <div className="p-4 border-t mt-auto">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
            {user.name?.charAt(0) || "U"}
          </div>
          <div className="flex flex-col truncate">
            <span className="text-sm font-medium leading-none mb-1">{user.name}</span>
            <span className="text-xs text-muted-foreground truncate">{user.email}</span>
          </div>
        </div>
        <form action="/api/auth/signout" method="POST">
          <Button variant="outline" className="w-full justify-start text-muted-foreground" type="submit">
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </Button>
        </form>
      </div>
    </>
  );
}
