"use client"

import { useEffect, useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { io } from "socket.io-client"
import { differenceInSeconds, formatDuration, intervalToDuration } from "date-fns"
import { Clock, DollarSign, ArrowLeft, AlertCircle, Loader2, Trophy, History, Timer, Gavel, Share2, Eye, User, Calendar } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

const socket = io("http://localhost:5000", {
  transports: ["polling"],
  withCredentials: true,
})

function AuctionDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [auctionItem, setAuctionItem] = useState(null)
  const [currentBid, setCurrentBid] = useState(0)
  const [newBid, setNewBid] = useState("")
  const [timeLeft, setTimeLeft] = useState("")
  const [highestBid, setHighestBid] = useState(null)
  const [allBids, setAllBids] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(0)
  const [auctionStatus, setAuctionStatus] = useState("active")

  // Fetch auction item
  useEffect(() => {
    const fetchAuctionItem = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`http://localhost:5000/auction/${id}`, { withCredentials: true })
        setAuctionItem(response.data.auctionItem)
        setCurrentBid(response.data.auctionItem.current_bid || 0)
        setHighestBid(response.data.highestBid)
        setAllBids(response.data.allBids || [])
        setLoading(false)
      } catch (error) {
        console.error("Error fetching auction item:", error)
        setError("Failed to load auction details. Please try again.")
        setLoading(false)
      }
    }

    fetchAuctionItem()
  }, [id])

  // Setup socket listeners
  useEffect(() => {
    socket.on("new_bid", (bidData) => {
      if (bidData.item_id === id) {
        setCurrentBid(bidData.amount)
        // Refresh bid history
        axios
          .get(`http://localhost:5000/auction/${id}`, { withCredentials: true })
          .then((response) => {
            setAllBids(response.data.allBids || [])
            setHighestBid(response.data.highestBid)
          })
          .catch((error) => console.error("Error refreshing bids:", error))
      }
    })

    return () => {
      socket.off("new_bid")
    }
  }, [id])

  // Countdown timer effect
  useEffect(() => {
    if (!auctionItem?.end_time) return

    const endTime = new Date(auctionItem.end_time) // Supabase timestamps are in UTC!

    const interval = setInterval(() => {
      const now = new Date() // Local time
      const secondsLeft = Math.floor((endTime.getTime() - now.getTime()) / 1000)
      setTimeLeftSeconds(secondsLeft)

      if (secondsLeft <= 0) {
        setTimeLeft("Auction Ended")
        setAuctionStatus("ended")
        clearInterval(interval)
      } else if (secondsLeft <= 86400) {
        // Less than 24 hours
        setAuctionStatus("ending-soon")
        const duration = intervalToDuration({ start: now, end: endTime })
        setTimeLeft(formatDuration(duration, { format: ["hours", "minutes", "seconds"] }))
      } else {
        setAuctionStatus("active")
        const duration = intervalToDuration({ start: now, end: endTime })
        setTimeLeft(formatDuration(duration, { format: ["days", "hours", "minutes"] }))
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [auctionItem])

  const handlePlaceBid = async () => {
    if (!newBid || Number(newBid) <= currentBid) {
      alert("Your bid must be higher than the current bid!")
      return
    }

    try {
      setIsSubmitting(true)
      await axios.post(
        `http://localhost:5000/auction/${id}/bid`,
        { bid_amount: Number(newBid) },
        { withCredentials: true }
      )

      socket.emit("place_bid", {
        item_id: id,
        amount: Number(newBid),
      })

      setNewBid("")
    } catch (error) {
      console.error("Error placing bid:", error.response?.data || error.message)
      alert(error.response?.data?.error || "Failed to place bid")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>
      case "ending-soon":
        return <Badge variant="destructive">Ending Soon</Badge>
      case "ended":
        return <Badge variant="outline" className="text-muted-foreground">Ended</Badge>
      default:
        return null
    }
  }

  // Render loading skeleton
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <div className="flex items-center gap-2 mb-6">
          <Skeleton className="h-10 w-24" />
        </div>
        <Skeleton className="h-8 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-6" />
        <Skeleton className="h-[400px] w-full rounded-lg mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <Skeleton className="h-6 w-1/3 mb-2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div>
            <Skeleton className="h-[300px] w-full rounded-lg" />
          </div>
        </div>
      </div>
    )
  }

  // Render error state
  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
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

  if (!auctionItem) return null

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Back button */}
      <div>
        <Button variant="ghost" size="sm" onClick={() => navigate("/auction")} className="flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" />
          Back to Auctions
        </Button>
      </div>

      {/* Auction header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          {getStatusBadge(auctionStatus)}
          <span className="text-sm text-muted-foreground">
            Auction #{auctionItem.id}
          </span>
        </div>
        <h1 className="text-3xl font-bold">{auctionItem.title}</h1>
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>Started: {formatDate(auctionItem.start_time)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>Ends: {formatDate(auctionItem.end_time)}</span>
          </div>
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span>Owner ID: {auctionItem.owner_id}</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left column - Image and description */}
        <div className="md:col-span-2 space-y-6">
          <div className="rounded-lg overflow-hidden border">
            <img
              src={auctionItem.image_url || "/placeholder.svg?height=400&width=600"}
              alt={auctionItem.title}
              className="w-full h-auto object-cover"
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Description</h2>
            <p className="text-muted-foreground leading-relaxed">{auctionItem.description}</p>
          </div>

          <Tabs defaultValue="bids" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="bids" className="flex items-center gap-2">
                <History className="h-4 w-4" />
                Bid History
              </TabsTrigger>
              <TabsTrigger value="details" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Auction Details
              </TabsTrigger>
            </TabsList>
            <TabsContent value="bids" className="pt-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Bid History</CardTitle>
                </CardHeader>
                <CardContent>
                  {allBids.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Gavel className="h-12 w-12 mx-auto mb-2 text-muted-foreground/50" />
                      <p>No bids placed yet. Be the first to bid!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {allBids.map((bid, index) => (
                        <div
                          key={index}
                          className={`flex items-center gap-3 p-3 rounded-lg ${
                            index === 0 ? "bg-amber-50 border border-amber-200" : "bg-muted/30"
                          }`}
                        >
                          <Avatar className="h-10 w-10 border">
                            <AvatarFallback className={index === 0 ? "bg-amber-100 text-amber-700" : ""}>
                              {bid.user_id.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex justify-between items-center">
                              <p className="font-medium flex items-center">
                                {index === 0 && <Trophy className="h-4 w-4 text-amber-600 mr-1" />}
                                User {bid.user_id.substring(0, 8)}...
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(bid.bid_time).toLocaleTimeString()}
                              </p>
                            </div>
                            <p className={`text-lg font-bold ${index === 0 ? "text-amber-600" : ""}`}>
                              {formatCurrency(bid.amount)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="details" className="pt-4">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Starting Bid</p>
                      <p className="font-medium">{formatCurrency(auctionItem.starting_bid || 0)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Current Bid</p>
                      <p className="font-medium">{formatCurrency(currentBid)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Auction Start</p>
                      <p className="font-medium">{formatDate(auctionItem.start_time)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Auction End</p>
                      <p className="font-medium">{formatDate(auctionItem.end_time)}</p>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground">Owner ID</p>
                    <p className="font-medium">{auctionItem.owner_id}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right column - Bid information */}
        <div>
          <Card className="sticky top-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Auction Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Current bid */}
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Current Bid</p>
                <p className="text-3xl font-bold text-primary">{formatCurrency(currentBid)}</p>
              </div>

              {/* Time left */}
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Time Remaining</p>
                <div className="flex items-center gap-2">
                  <Timer className={`h-5 w-5 ${auctionStatus === "ending-soon" ? "text-red-500" : "text-amber-500"}`} />
                  <p
                    className={`text-lg font-semibold ${
                      auctionStatus === "ended"
                        ? "text-muted-foreground"
                        : auctionStatus === "ending-soon"
                        ? "text-red-500"
                        : "text-amber-500"
                    }`}
                  >
                    {timeLeft}
                  </p>
                </div>
              </div>

              {/* Progress bar */}
              {auctionStatus !== "ended" && (
                <div className="pt-2">
                  <Progress
                    value={
                      auctionStatus === "ending-soon"
                        ? 100 - (timeLeftSeconds / 86400) * 100
                        : 50
                    }
                    className="h-2"
                    indicatorClassName={auctionStatus === "ending-soon" ? "bg-red-500" : ""}
                  />
                </div>
              )}

              <Separator />

              {/* Bid form */}
              {auctionStatus !== "ended" ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-muted-foreground" />
                    <Input
                      type="number"
                      placeholder="Enter your bid"
                      value={newBid}
                      onChange={(e) => setNewBid(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                  <Button
                    onClick={handlePlaceBid}
                    className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500"
                    disabled={isSubmitting || auctionStatus === "ended"}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Gavel className="mr-2 h-4 w-4" />
                        Place Bid
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    Your bid must be higher than {formatCurrency(currentBid)}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <Alert className="bg-amber-50 border-amber-200">
                    <Trophy className="h-4 w-4 text-amber-600" />
                    <AlertTitle className="text-amber-800">Auction Ended</AlertTitle>
                    <AlertDescription className="text-amber-700">
                      This auction has ended and is no longer accepting bids.
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-center pt-0">
              <Button variant="ghost" size="sm" className="text-xs gap-1">
                <Share2 className="h-3 w-3" />
                Share Auction
              </Button>
            </CardFooter>
          </Card>

          {/* Winner card */}
          {auctionStatus === "ended" && highestBid && (
            <Card className="mt-4 bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2 text-amber-800">
                  <Trophy className="h-5 w-5 text-amber-600" />
                  Auction Winner
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 border-2 border-amber-200">
                    <AvatarFallback className="bg-amber-100 text-amber-700">
                      {highestBid.user_id.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">User {highestBid.user_id.substring(0, 8)}...</p>
                    <p className="text-2xl font-bold text-amber-600">{formatCurrency(highestBid.amount)}</p>
                    <p className="text-xs text-muted-foreground">
                      Winning bid placed on {new Date(highestBid.bid_time).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default AuctionDetail
