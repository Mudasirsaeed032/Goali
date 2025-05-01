"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import { Gavel, Trash2, AlertCircle, ArrowLeft, Edit, Loader2, Clock, DollarSign, Plus, ImageIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

function ManageAuctions() {
  const [auctions, setAuctions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  const fetchAuctions = async () => {
    try {
      setLoading(true)
      const res = await axios.get("http://localhost:5000/auction/admin", {
        withCredentials: true,
      })
      setAuctions(res.data || [])
      setLoading(false)
    } catch (err) {
      console.error("Failed to fetch auctions", err)
      setError("Failed to load auctions. Please try again.")
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    setDeletingId(id)

    try {
      await axios.delete(`http://localhost:5000/auction/admin/${id}`, {
        withCredentials: true,
      })
      setAuctions((prev) => prev.filter((item) => item.id !== id))
    } catch (err) {
      console.error("Delete failed", err)
      alert("Could not delete auction item")
    } finally {
      setDeletingId(null)
    }
  }

  useEffect(() => {
    fetchAuctions()
  }, [])

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "No date specified"

    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Check if auction is active
  const isAuctionActive = (item) => {
    const now = new Date()
    const endTime = new Date(item.end_time)
    return now < endTime
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
              <div className="aspect-video relative">
                <Skeleton className="h-full w-full absolute" />
              </div>
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-4" />
                <Skeleton className="h-4 w-1/2" />
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
            <Gavel className="mr-2 h-7 w-7 text-amber-600" />
            Manage Auctions
          </h1>
          <p className="text-muted-foreground mt-1">Create and manage auction listings</p>
        </div>
        <Link to="/admin/auctions/create">
          <Button className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800">
            <Plus className="mr-2 h-4 w-4" />
            Create Auction
          </Button>
        </Link>
      </div>

      {/* No auctions */}
      {auctions.length === 0 && (
        <div className="text-center py-12 bg-muted/20 rounded-lg">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <Gavel className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">No auctions found</h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            There are no auction items created yet. Create your first auction to get started.
          </p>
          <Link to="/admin/auctions/create">
            <Button>Create Auction</Button>
          </Link>
        </div>
      )}

      {/* Auctions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {auctions.map((item) => {
          const isActive = isAuctionActive(item)

          return (
            <Card key={item.id} className="overflow-hidden transition-all hover:shadow-md">
              <div className="aspect-video relative overflow-hidden bg-muted">
                {item.image_url ? (
                  <img
                    src={item.image_url || "/placeholder.svg"}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-muted-foreground/50" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  {isActive ? (
                    <Badge className="bg-green-600 hover:bg-green-700">Active</Badge>
                  ) : (
                    <Badge variant="outline" className="bg-muted/80 backdrop-blur-sm">
                      Ended
                    </Badge>
                  )}
                </div>
              </div>

              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{item.title}</CardTitle>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{item.description}</p>
              </CardHeader>

              <CardContent className="pt-4 space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <DollarSign className="h-5 w-5 mr-1 text-amber-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Current Bid</p>
                      <p className="text-lg font-bold">{formatCurrency(item.current_bid)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Bids</p>
                    <p className="font-medium">{item.bid_count || 0}</p>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span className="text-muted-foreground">Start:</span>
                    </div>
                    <p className="font-medium">{formatDate(item.start_time)}</p>
                  </div>
                  <div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span className="text-muted-foreground">End:</span>
                    </div>
                    <p className="font-medium">{formatDate(item.end_time)}</p>
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
                        `Are you sure you want to delete the auction "${item.title}"? This action cannot be undone.`,
                      )
                    ) {
                      handleDelete(item.id)
                    }
                  }}
                  disabled={deletingId === item.id}
                >
                  {deletingId === item.id ? (
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

export default ManageAuctions
