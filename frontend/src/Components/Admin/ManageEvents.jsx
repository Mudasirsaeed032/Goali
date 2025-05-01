"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import { Calendar, Trash2, AlertCircle, ArrowLeft, Edit, Loader2, MapPin, Ticket, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

function ManageEvents() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const res = await axios.get("http://localhost:5000/events/admin", {
        withCredentials: true,
      })
      setEvents(res.data || [])
      setLoading(false)
    } catch (err) {
      console.error("Failed to fetch events", err)
      setError("Failed to load events. Please try again.")
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    setDeletingId(id)

    try {
      const res = await axios.delete(`http://localhost:5000/events/admin/${id}`, {
        withCredentials: true,
      })

      if (res.status === 200) {
        setEvents((prev) => prev.filter((event) => event.id !== id))
      } else {
        console.error("Unexpected status code:", res.status)
        alert("Failed to delete event")
      }
    } catch (err) {
      console.error("Delete failed:", err.response?.data || err.message)
      alert("Could not delete event")
    } finally {
      setDeletingId(null)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "usd",
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
    })
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
            <Calendar className="mr-2 h-7 w-7 text-primary-600" />
            Manage Events
          </h1>
          <p className="text-muted-foreground mt-1">Create and manage event listings</p>
        </div>
        <Link to="/events/create">
          <Button className="bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700">
            <Plus className="mr-2 h-4 w-4" />
            Create Event
          </Button>
        </Link>
      </div>

      {/* No events */}
      {events.length === 0 && (
        <div className="text-center py-12 bg-muted/20 rounded-lg">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <Calendar className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">No events found</h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            There are no events created yet. Create your first event to get started.
          </p>
          <Link to="/events/create">
            <Button>Create Event</Button>
          </Link>
        </div>
      )}

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map((event) => (
          <Card key={event.id} className="overflow-hidden transition-all hover:shadow-md">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{event.title}</CardTitle>
                <Badge variant="outline" className="bg-secondary-50 text-secondary-700 hover:bg-secondary-100">
                  {event.tickets_sold || 0} Tickets Sold
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{event.description}</p>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{event.location}</span>
                  </div>

                  {event.date && (
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center text-sm justify-end">
                    <Ticket className="h-4 w-4 mr-2 text-secondary-600" />
                    <span className="font-medium text-secondary-700">{formatCurrency(event.price)}</span>
                  </div>

                  <div className="flex items-center text-sm justify-end">
                    <span className="text-muted-foreground">
                      Revenue:{" "}
                      <span className="font-medium">{formatCurrency((event.tickets_sold || 0) * event.price)}</span>
                    </span>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Created: {formatDate(event.created_at)}</span>
                <Link to={`/events/${event.id}`} className="text-primary-600 hover:underline">
                  View Event
                </Link>
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
                      `Are you sure you want to delete the event "${event.title}"? This action cannot be undone.`,
                    )
                  ) {
                    handleDelete(event.id)
                  }
                }}
                disabled={deletingId === event.id}
              >
                {deletingId === event.id ? (
                  <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="mr-1 h-4 w-4" />
                )}
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default ManageEvents
