"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import { Ticket, MapPin, Calendar, Download, ArrowLeft, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

function MyTickets() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true)
        const res = await axios.get("http://localhost:5000/tickets/my", {
          withCredentials: true,
        })
        setTickets(res.data || [])
        setLoading(false)
      } catch (err) {
        console.error("Failed to load tickets", err)
        setError("Failed to load tickets. Please try again.")
        setLoading(false)
      }
    }

    fetchTickets()
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
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Render loading skeletons
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-64" />
        </div>
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-40 w-40" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-40" />
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

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Ticket className="mr-2 h-6 w-6 text-primary-600" />
            My Tickets
          </h1>
          <p className="text-muted-foreground mt-1">Your purchased event tickets</p>
        </div>
        <Link to="/events">
          <Button variant="outline" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Button>
        </Link>
      </div>

      {/* No tickets */}
      {tickets.length === 0 && (
        <div className="text-center py-12 bg-muted/20 rounded-lg">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <Ticket className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">No tickets found</h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            You haven't purchased any tickets yet. Browse our events to find something you'd like to attend.
          </p>
          <Link to="/events">
            <Button>Browse Events</Button>
          </Link>
        </div>
      )}

      {/* Tickets List */}
      <div className="space-y-6">
        {tickets.map((ticket) => (
          <Card key={ticket.id} className="overflow-hidden transition-all hover:shadow-md">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{ticket.events?.title}</CardTitle>
                  <p className="text-muted-foreground mt-1 line-clamp-2">{ticket.events?.description}</p>
                </div>
                <Badge className="bg-primary-600 hover:bg-primary-700">Ticket #{ticket.id}</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{ticket.events?.location}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Issued on: {formatDate(ticket.created_at)}</span>
                    </div>
                    <div className="flex items-center pt-1">
                      <span className="text-sm text-muted-foreground mr-2">Price:</span>
                      <span className="font-bold text-primary-700">{formatCurrency(ticket.events?.price)}</span>
                    </div>
                  </div>

                  <Separator className="my-2" />

                  <div className="flex flex-col space-y-2">
                    <p className="text-sm font-medium">Present this QR code at the event</p>
                    <a href={ticket.qr_code_url} download={`ticket-${ticket.id}.png`} className="w-fit">
                      <Button variant="outline" size="sm" className="flex items-center">
                        <Download className="mr-2 h-4 w-4" />
                        Download QR Code
                      </Button>
                    </a>
                  </div>
                </div>

                <div className="flex justify-center md:justify-end">
                  <div className="bg-white p-2 border rounded-lg shadow-sm">
                    <img
                      src={ticket.qr_code_url || "/placeholder.svg"}
                      alt="Ticket QR"
                      className="h-40 w-40 object-cover"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default MyTickets
