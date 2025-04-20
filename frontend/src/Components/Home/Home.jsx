"use client"

import { useOutletContext } from "react-router-dom"
import { Link } from "react-router-dom"
import { Target, User, Mail, Shield, ChevronRight, Info } from "lucide-react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"

function Home() {
  const { user } = useOutletContext()

  return (
    <Card className="max-w-3xl mx-auto border-none shadow-lg">
      <CardHeader className="text-center space-y-2">
        <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
          <Target className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-3xl font-bold">Welcome to GOALI</CardTitle>
        <CardDescription className="text-base max-w-md mx-auto">
          Explore fundraisers, support causes, and participate in auctions – no account needed.
        </CardDescription>
      </CardHeader>

      <Separator className="my-2" />

      <CardContent className="pt-6">
        {user ? (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className="bg-primary/10 p-2 rounded-full">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Full Name</p>
                  <p className="font-medium">{user.full_name}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">Account Type:</p>
              <Badge variant={user.role === "admin" ? "default" : "secondary"} className="capitalize">
                {user.role === "admin" ? <Shield className="h-3 w-3 mr-1" /> : null}
                {user.role}
              </Badge>
            </div>

            {user.role === "admin" && (
              <Alert className="bg-amber-50 border-amber-200 text-amber-800">
                <Shield className="h-4 w-4" />
                <AlertTitle className="text-amber-800">Admin Access</AlertTitle>
                <AlertDescription className="text-amber-700">
                  You have access to admin-only tools like user promotion and dashboard insights.
                </AlertDescription>
              </Alert>
            )}
          </div>
        ) : (
          <div className="text-center space-y-6 py-4">
            <div className="bg-muted/50 p-6 rounded-lg max-w-md mx-auto">
              <Info className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Want to start your own fundraiser or join an auction?</h3>
              <p className="text-muted-foreground mb-6">
                Create an account to unlock all features and start making a difference today.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild variant="outline">
                  <Link to="/login">Log in</Link>
                </Button>
                <Button asChild>
                  <Link to="/signup">
                    Create an account
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-center pt-2 pb-6 text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} GOALI. All rights reserved.</p>
      </CardFooter>
    </Card>
  )
}

export default Home
