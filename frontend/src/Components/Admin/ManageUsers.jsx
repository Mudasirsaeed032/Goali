"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import { Users, AlertCircle, ArrowLeft, Search, UserCog, Shield, User, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

function ManageUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [updatingUserId, setUpdatingUserId] = useState(null)

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const res = await axios.get("http://localhost:5000/users/admin", {
        withCredentials: true,
      })
      setUsers(res.data || [])
      setLoading(false)
    } catch (err) {
      console.error("Failed to fetch users", err)
      setError("Failed to load users. Please try again.")
      setLoading(false)
    }
  }

  const toggleRole = async (userId, currentRole) => {
    const newRole = currentRole === "admin" ? "client" : "admin"
    setUpdatingUserId(userId)

    try {
      await axios.patch(
        `http://localhost:5000/users/admin/${userId}`,
        { role: newRole },
        {
          withCredentials: true,
        },
      )
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)))
    } catch (err) {
      console.error("Failed to update user role", err)
      alert("Failed to update user role. Please try again.")
    } finally {
      setUpdatingUserId(null)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // Filter users based on search query
  const filteredUsers = users.filter(
    (user) =>
      user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id?.toString().includes(searchQuery),
  )

  // Get user initials for avatar
  const getUserInitials = (name) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  // Get role badge color
  const getRoleBadgeClass = (role) => {
    switch (role) {
      case "admin":
        return "bg-primary-600 hover:bg-primary-700"
      case "client":
        return "bg-secondary-600 hover:bg-secondary-700"
      default:
        return "bg-muted hover:bg-muted/80"
    }
  }

  // Render loading skeletons
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-40" />
        </div>
        <Skeleton className="h-10 w-full" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div>
                      <Skeleton className="h-5 w-32 mb-1" />
                      <Skeleton className="h-4 w-48" />
                    </div>
                  </div>
                  <Skeleton className="h-8 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  // Render error state
  if (error) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="mt-4 text-center">
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Link
            to="/admin"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-2"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold flex items-center">
            <Users className="mr-2 h-7 w-7 text-primary-600" />
            Manage Users
          </h1>
          <p className="text-muted-foreground mt-1">View and manage user accounts</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="px-2 py-1">
            Total Users: {users.length}
          </Badge>
          <Badge variant="outline" className="bg-primary-50 text-primary-700 px-2 py-1">
            Admins: {users.filter((u) => u.role === "admin").length}
          </Badge>
          <Badge variant="outline" className="bg-secondary-50 text-secondary-700 px-2 py-1">
            Clients: {users.filter((u) => u.role === "client").length}
          </Badge>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search users by name, email or ID..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* No users */}
      {filteredUsers.length === 0 && (
        <div className="text-center py-12 bg-muted/20 rounded-lg">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <Users className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">No users found</h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            {searchQuery
              ? `No users match your search for "${searchQuery}"`
              : "There are no users registered in the system yet."}
          </p>
          {searchQuery && (
            <Button variant="outline" onClick={() => setSearchQuery("")}>
              Clear Search
            </Button>
          )}
        </div>
      )}

      {/* Users List */}
      <div className="space-y-4">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="overflow-hidden transition-all hover:shadow-sm">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border">
                    <AvatarFallback className="bg-muted">{getUserInitials(user.full_name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{user.full_name}</div>
                    <div className="text-sm text-muted-foreground flex flex-wrap items-center gap-x-2">
                      <span>{user.email}</span>
                      <span className="text-muted-foreground/50">•</span>
                      <span className="text-xs">ID: {user.id}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-auto">
                  <Badge className={getRoleBadgeClass(user.role)}>
                    {user.role === "admin" ? <Shield className="mr-1 h-3 w-3" /> : <User className="mr-1 h-3 w-3" />}
                    {user.role}
                  </Badge>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <UserCog className="mr-2 h-4 w-4" />
                        View Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          const newRole = user.role === "admin" ? "client" : "admin"
                          const message = `Are you sure you want to change ${user.full_name}'s role from ${user.role} to ${newRole}?${
                            user.role === "client"
                              ? "\n\nWarning: This will grant the user administrative privileges."
                              : ""
                          }`

                          if (window.confirm(message)) {
                            toggleRole(user.id, user.role)
                          }
                        }}
                      >
                        <Shield className="mr-2 h-4 w-4" />
                        Change Role to {user.role === "admin" ? "Client" : "Admin"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default ManageUsers
