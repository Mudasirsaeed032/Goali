"use client"

import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { LogOut, Menu, Home, DollarSign, ShieldCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

function Navbar({ user, setUser }) {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await axios.post("http://localhost:5000/auth/logout", {}, { withCredentials: true })
    setUser(null)
    navigate("/login")
  }

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user?.full_name) return "U"
    return user.full_name
      .split(" ")
      .map((name) => name[0])
      .join("")
      .toUpperCase()
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[240px] sm:w-[300px]">
            <nav className="flex flex-col gap-4 mt-6">
              <Link to="/" className="flex items-center gap-2 text-lg font-semibold">
                <Home className="h-5 w-5" />
                Home
              </Link>
              <Link to="/fundraisers" className="flex items-center gap-2 text-lg font-semibold">
                <DollarSign className="h-5 w-5" />
                Fundraisers
              </Link>
              {user?.role === "admin" && (
                <Link to="/makeadmin" className="flex items-center gap-2 text-lg font-semibold">
                  <ShieldCheck className="h-5 w-5" />
                  Make Admin
                </Link>
              )}
              <div className="mt-4 pt-4 border-t">
                {user ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{getUserInitials()}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{user.full_name}</span>
                    </div>
                    <Button variant="destructive" size="sm" onClick={handleLogout} className="w-full">
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" onClick={() => navigate("/login")} className="w-full justify-start">
                      Login
                    </Button>
                    <Button onClick={() => navigate("/signup")} className="w-full justify-start">
                      Sign Up
                    </Button>
                  </div>
                )}
              </div>
            </nav>
          </SheetContent>
        </Sheet>

        {/* Desktop Navigation */}
        <div className="mr-4 hidden md:flex">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to="/">
                  <NavigationMenuLink className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                    <Home className="mr-2 h-4 w-4" />
                    Home
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/fundraisers">
                  <NavigationMenuLink className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                    <DollarSign className="mr-2 h-4 w-4" />
                    Fundraisers
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              {user?.role === "admin" && (
                <NavigationMenuItem>
                  <Link to="/makeadmin">
                    <NavigationMenuLink className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                      <ShieldCheck className="mr-2 h-4 w-4" />
                      Make Admin
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              )}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="ml-auto flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{getUserInitials()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.full_name}</p>
                      {user.email && <p className="text-xs leading-none text-muted-foreground">{user.email}</p>}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={() => navigate("/login")}>
                Login
              </Button>
              <Button onClick={() => navigate("/signup")}>Sign Up</Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
