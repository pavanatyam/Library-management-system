import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { BookOpen, Home, User, LineChart } from "lucide-react";

export default function Navbar() {
  const { user, logoutMutation } = useAuth();

  if (!user) return null;

  return (
    <nav className="border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <NavigationMenu className="h-16">
          <NavigationMenuList className="space-x-4">
            <NavigationMenuItem>
              <Link href="/">
                <Button variant="ghost" className="space-x-2">
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </Button>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/books">
                <Button variant="ghost" className="space-x-2">
                  <BookOpen className="h-4 w-4" />
                  <span>Books</span>
                </Button>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/profile">
                <Button variant="ghost" className="space-x-2">
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </Button>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/leads">
                <Button variant="ghost" className="space-x-2">
                  <LineChart className="h-4 w-4" />
                  <span>Leads</span>
                </Button>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Button
                variant="ghost"
                onClick={() => logoutMutation.mutate()}
                className="text-red-500"
              >
                Logout
              </Button>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </nav>
  );
}
