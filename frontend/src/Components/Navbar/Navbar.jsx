"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { LogOut, Menu, Home, DollarSign, BanknoteArrowUp, ShieldCheck, Ticket, CalendarDays, User, ChevronDown } from 'lucide-react'
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
import {Link} from "react-router-dom" // Assuming this is the correct import for your setup

// Define the theme colors
const theme = {
  primary: "#122ee5",
  secondary: "#eb7521",
}

function Navbar({ user, setUser }) {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/auth/logout", {}, { withCredentials: true })
      setUser(null)
      navigate("/login")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const getUserInitials = () => {
    if (!user?.full_name) return "U"
    return user.full_name
      .split(" ")
      .map((name) => name[0])
      .join("")
      .toUpperCase()
  }

  const NavLink = ({ to, icon: Icon, children, onClick }) => (
    <Link
      to={to}
      className="group flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-primary/10 hover:text-primary"
      onClick={onClick}
    >
      {Icon && <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary" />}
      <span>{children}</span>
    </Link>
  )

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-lg shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo/Brand */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
              <span className="text-lg font-bold text-white">G</span>
            </div>
            <span className="hidden text-xl font-bold text-primary md:inline-block">Goali</span>
          </Link>
        </div>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden" aria-label="Menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <div className="flex flex-col h-full">
              <div className="border-b p-4">
                <Link to="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
                    <span className="text-lg font-bold text-white">G</span>
                  </div>
                  <span className="text-xl font-bold text-primary">Goali</span>
                </Link>
              </div>

              <nav className="flex-1 overflow-auto p-4">
                <div className="space-y-1">
                  <NavLink to="/" icon={Home} onClick={() => setIsOpen(false)}>
                    Home
                  </NavLink>
                  <NavLink to="/fundraisers" icon={DollarSign} onClick={() => setIsOpen(false)}>
                    Fundraisers
                  </NavLink>
                  <NavLink to="/events" icon={CalendarDays} onClick={() => setIsOpen(false)}>
                    Events
                  </NavLink>
                  <NavLink to="/mytickets" icon={Ticket} onClick={() => setIsOpen(false)}>
                    My Tickets
                  </NavLink>

                  {/* Admin Section */}
                  {user?.role === "admin" && (
                    <>
                      <div className="my-2 border-t pt-2">
                        <p className="px-3 text-xs font-semibold uppercase text-muted-foreground">Admin</p>
                      </div>
                      <NavLink to="/admin" icon={ShieldCheck} onClick={() => setIsOpen(false)}>
                        Admin Dashboard
                      </NavLink>
                      <NavLink to="/makeadmin" icon={ShieldCheck} onClick={() => setIsOpen(false)}>
                        Make Admin
                      </NavLink>
                    </>
                  )}
                </div>
              </nav>

              <div className="border-t p-4">
                {user ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border-2 border-primary/20">
                        <AvatarFallback className="bg-primary/10 text-primary">{getUserInitials()}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{user.full_name}</span>
                        <span className="text-xs text-muted-foreground">{user.email}</span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => {
                        handleLogout()
                        setIsOpen(false)
                      }}
                      className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        navigate("/login")
                        setIsOpen(false)
                      }}
                      className="w-full justify-start"
                    >
                      <User className="mr-2 h-4 w-4" />
                      Login
                    </Button>
                    <Button
                      onClick={() => {
                        navigate("/signup")
                        setIsOpen(false)
                      }}
                      className="w-full justify-start bg-primary hover:bg-primary/90"
                    >
                      Sign Up
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList className="flex gap-1">
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  to="/"
                  className="group flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-primary/10 hover:text-primary"
                >
                  <Home className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                  Home
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  to="/fundraisers"
                  className="group flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-primary/10 hover:text-primary"
                >
                  <BanknoteArrowUp className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                  Fundraisers
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  to="/auction/create"
                  className="group flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-primary/10 hover:text-primary"
                >
                  <DollarSign className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                  Auctions
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  to="/events"
                  className="group flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-primary/10 hover:text-primary"
                >
                  <CalendarDays className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                  Events
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  to="/mytickets"
                  className="group flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-primary/10 hover:text-primary"
                >
                  <Ticket className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                  My Tickets
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* Admin Section - Visible only to admin */}
            {user?.role === "admin" && (
              <NavigationMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="group flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-primary/10 hover:text-primary"
                    >
                      <ShieldCheck className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                      Admin
                      <ChevronDown className="h-3 w-3 text-muted-foreground group-hover:text-primary" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="flex items-center">
                        <ShieldCheck className="mr-2 h-4 w-4" />
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/makeadmin" className="flex items-center">
                        <ShieldCheck className="mr-2 h-4 w-4" />
                        Make Admin
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </NavigationMenuItem>
            )}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Auth Controls */}
        <div className="flex items-center gap-2">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2 rounded-full px-2 hover:bg-primary/10"
                >
                  <Avatar className="h-8 w-8 border-2 border-primary/20">
                    <AvatarFallback className="bg-primary/10 text-primary">{getUserInitials()}</AvatarFallback>
                  </Avatar>
                  <span className="hidden text-sm font-medium md:inline-block">{user.full_name?.split(" ")[0]}</span>
                  <ChevronDown className="h-3 w-3 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user.full_name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/mytickets" className="flex items-center">
                    <Ticket className="mr-2 h-4 w-4" />
                    My Tickets
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" onClick={() => navigate("/login")} className="hidden sm:flex">
                Login
              </Button>
              <Button onClick={() => navigate("/signup")} className="bg-primary hover:bg-primary/90">
                Sign Up
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
