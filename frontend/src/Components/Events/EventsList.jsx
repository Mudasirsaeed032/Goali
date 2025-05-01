"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Calendar, Search, ArrowUpDown, AlertCircle, Ticket, Clock, MapPin, Plus } from "lucide-react"
import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function EventsList() {
  const [events, setEvents] = useState([])
  const [filteredEvents, setFilteredEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("date")

  // Fetch all events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        const res = await axios.get("http://localhost:5000/events", {
          withCredentials: true,
        })

        const eventsData = res.data || []
        setEvents(eventsData)
        setFilteredEvents(eventsData)
        setLoading(false)
      } catch (err) {
        console.error("Failed to load events", err)
        setError("Failed to load events. Please try again.")
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  // Filter and sort events
  useEffect(() => {
    let result = [...events]

    // Apply search filter
    if (searchQuery) {
      result = result.filter(
        (event) =>
          event.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.location?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Apply sorting
    switch (sortBy) {
      case "date":
        result = result.sort((a, b) => new Date(a.date) - new Date(b.date))
        break
      case "price-high":
        result = result.sort((a, b) => b.price - a.price)
        break
      case "price-low":
        result = result.sort((a, b) => a.price - b.price)
        break
      case "name":
        result = result.sort((a, b) => a.title.localeCompare(b.title))
        break
      default:
        break
    }

    setFilteredEvents(result)
  }, [events, searchQuery, sortBy])

  // Handle buying ticket
  const handleBuyTicket = async (eventId) => {
    try {
      const res = await axios.post(
        `http://localhost:5000/events/${eventId}/checkout-session`,
        {},
        {
          withCredentials: true,
        },
      )
      window.location.href = res.data.url // Redirect to Stripe Checkout
    } catch (err) {
      console.error("Checkout error", err)
      alert("Could not start checkout. Are you logged in?")
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
          <h1 className="text-3xl font-bold">Upcoming Events</h1>
          <p className="text-muted-foreground mt-1">Book tickets for exciting events</p>
        </div>
        {/* Added Create Event Button */}
        <Link to="/event/create">
          <Button className="bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700">
            <Plus className="mr-2 h-4 w-4" />
            Create Event
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
              placeholder="Search events..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex gap-2">
                  <ArrowUpDown className="h-4 w-4" />
                  Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSortBy("date")}>Date (Soonest)</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("price-low")}>Price (Low to High)</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("price-high")}>Price (High to Low)</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("name")}>Name (A-Z)</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-medium">{filteredEvents.length}</span> of{" "}
          <span className="font-medium">{events.length}</span> events
        </p>
      </div>

      {/* No results */}
      {filteredEvents.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <Calendar className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">No events found</h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            We couldn't find any events matching your search criteria. Try adjusting your filters or search terms.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery("")
              setSortBy("date")
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}

      {/* Events Grid */}
      {filteredEvents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="overflow-hidden transition-all hover:shadow-md">
              <CardHeader className="p-4 pb-0">
                <CardTitle className="text-lg line-clamp-1">{event.title}</CardTitle>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{event.description}</p>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{event.location}</span>
                  </div>

                  {event.date && (
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>
                        {new Date(event.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Ticket Price</p>
                      <p className="text-xl font-bold text-primary-700">{formatCurrency(event.price)}</p>
                    </div>
                    <div className="flex items-center text-sm">
                      <Ticket className="h-4 w-4 mr-1 text-secondary-600" />
                      <span className="text-secondary-600 font-medium">
                        {event.tickets_available ? `${event.tickets_available} left` : "Available"}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button
                  className="w-full bg-secondary hover:bg-secondary-700"
                  onClick={() => handleBuyTicket(event.id)}
                >
                  Buy Ticket
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
