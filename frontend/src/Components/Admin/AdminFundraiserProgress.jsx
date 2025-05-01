"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import { DollarSign, Trash2, AlertCircle, ArrowLeft, Edit, Loader2, BarChart3, Target } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

function AdminFundraiserProgress() {
  const [fundraisers, setFundraisers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    const fetchFundraisers = async () => {
      try {
        setLoading(true)
        const res = await axios.get("http://localhost:5000/fundraisers/admin", {
          withCredentials: true,
        })
        setFundraisers(res.data || [])
        setLoading(false)
      } catch (err) {
        console.error("Failed to load fundraisers", err)
        setError("Failed to load fundraisers. Please try again.")
        setLoading(false)
      }
    }

    fetchFundraisers()
  }, [])

  const handleDelete = async (id) => {
    setDeletingId(id)

    try {
      const res = await axios.delete(`http://localhost:5000/fundraisers/admin/${id}`, {
        withCredentials: true,
      })

      if (res.status === 200) {
        setFundraisers((prev) => prev.filter((f) => f.id !== id))
      } else {
        console.error("Delete failed: Unexpected status", res.status)
        alert("Could not delete fundraiser.")
      }
    } catch (error) {
      console.error("Delete failed", error)
      alert("Could not delete fundraiser.")
    } finally {
      setDeletingId(null)
    }
  }

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "usd",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  // Render loading skeletons
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-4" />
                <Skeleton className="h-2 w-full mb-2" />
                <Skeleton className="h-6 w-1/3" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
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
            <BarChart3 className="mr-2 h-7 w-7 text-primary-600" />
            Fundraiser Progress
          </h1>
          <p className="text-muted-foreground mt-1">Monitor and manage fundraising campaigns</p>
        </div>
        <Link to="/admin/fundraisers/create">
          <Button className="bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700">
            Create Fundraiser
          </Button>
        </Link>
      </div>

      {/* No fundraisers */}
      {fundraisers.length === 0 && (
        <div className="text-center py-12 bg-muted/20 rounded-lg">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <DollarSign className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">No fundraisers found</h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            There are no active fundraising campaigns at the moment.
          </p>
          <Link to="/admin/fundraisers/create">
            <Button>Create Fundraiser</Button>
          </Link>
        </div>
      )}

      {/* Fundraisers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fundraisers.map((f) => {
          const percent = f.goal_amount ? Math.min(100, (f.collected_amount / f.goal_amount) * 100).toFixed(1) : 0
          const isCompleted = percent >= 100

          return (
            <Card key={f.id} className="overflow-hidden transition-all hover:shadow-md">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{f.title}</CardTitle>
                  {isCompleted ? (
                    <Badge className="bg-green-600 hover:bg-green-700">Completed</Badge>
                  ) : (
                    <Badge variant="outline">In Progress</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{f.description}</p>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Target className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">
                      Goal: <span className="font-medium">{formatCurrency(f.goal_amount)}</span>
                    </span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-1 text-green-600" />
                    <span className="text-sm">
                      Raised: <span className="font-medium text-green-600">{formatCurrency(f.collected_amount)}</span>
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <Progress value={percent} className="h-2" indicatorClassName={isCompleted ? "bg-green-600" : ""} />
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>{percent}% Complete</span>
                    <span>
                      {isCompleted ? "Goal reached!" : `${formatCurrency(f.goal_amount - f.collected_amount)} to go`}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0 flex justify-between">
                <Button variant="outline" size="sm" className="flex items-center">
                  <Edit className="mr-1 h-4 w-4" />
                  Edit
                </Button>

                <Button
                  variant="destructive"
                  size="sm"
                  className="flex items-center bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => {
                    if (
                      window.confirm(
                        `Are you sure you want to delete the fundraiser "${f.title}"? This action cannot be undone.`,
                      )
                    ) {
                      handleDelete(f.id)
                    }
                  }}
                  disabled={deletingId === f.id}
                >
                  {deletingId === f.id ? (
                    <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="mr-1 h-4 w-4" />
                  )}
                  Delete
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

export default AdminFundraiserProgress
