"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import { Clock, Search, Plus, ArrowUpDown, AlertCircle, Gavel, Timer, CheckCircle2, Loader2, Filter } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"

function AuctionList() {
  const [auctions, setAuctions] = useState([])
  const [filteredAuctions, setFilteredAuctions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("ending-soon")
  const [filterStatus, setFilterStatus] = useState("all")

  // Fetch all auctions
  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        setLoading(true)
        const response = await axios.get("http://localhost:5000/auction", {
          withCredentials: true,
        })
        
        // Add status property based on end_time
        const auctionsWithStatus = response.data.map(auction => {
          const endTime = new Date(auction.end_time)
          const now = new Date()
          const hoursLeft = (endTime - now) / (1000 * 60 * 60)
          
          let status = "active"
          if (hoursLeft <= 0) {
            status = "ended"
          } else if (hoursLeft <= 24) {
            status = "ending-soon"
          }
          
          return {
            ...auction,
            status,
            hoursLeft: hoursLeft > 0 ? Math.floor(hoursLeft) : 0
          }
        })
        
        setAuctions(auctionsWithStatus)
        setFilteredAuctions(auctionsWithStatus)
        setLoading(false)
      } catch (error) {
        console.error("Failed to fetch auctions:", error)
        setError("Failed to load auctions. Please try again.")
        setLoading(false)
      }
    }

    fetchAuctions()
  }, [])

  // Filter and sort auctions
  useEffect(() => {
    let result = [...auctions]
    
    // Apply search filter
    if (searchQuery) {
      result = result.filter(
        auction => 
          auction.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          auction.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    // Apply status filter
    if (filterStatus !== "all") {
      result = result.filter(auction => auction.status === filterStatus)
    }
    
    // Apply sorting
    switch (sortBy) {
      case "ending-soon":
        result = result.sort((a, b) => {
          // Put ended auctions at the end
          if (a.status === "ended" && b.status !== "ended") return 1
          if (a.status !== "ended" && b.status === "ended") return -1
          return new Date(a.end_time) - new Date(b.end_time)
        })
        break
      case "highest-bid":
        result = result.sort((a, b) => b.current_bid - a.current_bid)
        break
      case "lowest-bid":
        result = result.sort((a, b) => a.current_bid - b.current_bid)
        break
      case "newest":
        result = result.sort((a, b) => new Date(b.start_time) - new Date(a.start_time))
        break
      default:
        break
    }
    
    setFilteredAuctions(result)
  }, [auctions, searchQuery, sortBy, filterStatus])

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount)
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

  // Render loading skeletons
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-4" />
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
      <div className="max-w-7xl mx-auto p-6">
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
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Auctions</h1>
          <p className="text-muted-foreground mt-1">Bid on unique items and experiences</p>
        </div>
        <Link to="/auction/create">
          <Button className="bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500">
            <Plus className="mr-2 h-4 w-4" />
            Create New Auction
          </Button>
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="bg-muted/40 rounded-lg p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search auctions..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex gap-2">
                  <Filter className="h-4 w-4" />
                  {filterStatus === "all" ? "All Status" : 
                   filterStatus === "active" ? "Active" : 
                   filterStatus === "ending-soon" ? "Ending Soon" : "Ended"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setFilterStatus("all")}>
                  All Status
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("active")}>
                  Active
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("ending-soon")}>
                  Ending Soon
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("ended")}>
                  Ended
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex gap-2">
                  <ArrowUpDown className="h-4 w-4" />
                  Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSortBy("ending-soon")}>
                  Ending Soon
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("highest-bid")}>
                  Highest Bid
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("lowest-bid")}>
                  Lowest Bid
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("newest")}>
                  Newest
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-medium">{filteredAuctions.length}</span> of{" "}
          <span className="font-medium">{auctions.length}</span> auctions
        </p>
      </div>

      {/* No results */}
      {filteredAuctions.length === 0 && (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <Gavel className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">No auctions found</h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            We couldn't find any auctions matching your search criteria. Try adjusting your filters or search terms.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery("")
              setFilterStatus("all")
              setSortBy("ending-soon")
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}

      {/* Auctions Grid */}
      {filteredAuctions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAuctions.map((auction) => (
            <Card key={auction.id} className="overflow-hidden transition-all hover:shadow-md">
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={auction.image_url || "/placeholder.svg?height=200&width=400"}
                  alt={auction.title}
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
                <div className="absolute top-2 right-2">
                  {getStatusBadge(auction.status)}
                </div>
              </div>
              <CardHeader className="p-4 pb-0">
                <CardTitle className="text-lg line-clamp-1">{auction.title}</CardTitle>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {auction.description}
                </p>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Current Bid</p>
                      <p className="text-xl font-bold text-primary">
                        {formatCurrency(auction.current_bid)}
                      </p>
                    </div>
                    <div className="text-right">
                      {auction.status === "ended" ? (
                        <div className="flex items-center text-muted-foreground">
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          <span className="text-sm">Auction Ended</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-amber-600">
                          <Timer className="h-4 w-4 mr-1" />
                          <span className="text-sm font-medium">
                            {auction.hoursLeft > 24
                              ? `${Math.floor(auction.hoursLeft / 24)}d left`
                              : auction.hoursLeft > 0
                              ? `${auction.hoursLeft}h left`
                              : "Ending soon"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {auction.status !== "ended" && (
                    <Progress
                      value={
                        auction.status === "ending-soon"
                          ? 100 - (auction.hoursLeft / 24) * 100
                          : 50
                      }
                      className="h-1"
                      indicatorClassName={
                        auction.status === "ending-soon" ? "bg-red-500" : ""
                      }
                    />
                  )}
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Link to={`/auction/${auction.id}`} className="w-full">
                  <Button
                    className="w-full"
                    variant={auction.status === "ended" ? "outline" : "default"}
                  >
                    {auction.status === "ended" ? "View Results" : "Place Bid"}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default AuctionList
