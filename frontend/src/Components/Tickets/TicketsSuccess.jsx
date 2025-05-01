"use client"

import { useEffect, useRef, useState } from "react"
import { useSearchParams, Link } from "react-router-dom"
import axios from "axios"
import { CheckCircle, XCircle, Loader2, Ticket, ArrowLeft, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

function TicketSuccess() {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState("processing") // processing, success, error
  const [message, setMessage] = useState("Creating your ticket...")
  const eventId = searchParams.get("eventId")
  const hasCreatedTicket = useRef(false)

  useEffect(() => {
    const generateTicket = async () => {
      if (hasCreatedTicket.current || !eventId) return

      hasCreatedTicket.current = true

      try {
        const res = await axios.post(
          "http://localhost:5000/tickets",
          { event_id: eventId },
          {
            withCredentials: true,
          },
        )

        setStatus("success")
        setMessage("Your ticket has been created successfully!")
      } catch (err) {
        console.error("Ticket creation failed", err)
        setStatus("error")
        setMessage(err.response?.data?.message || "Failed to create ticket. Please try again.")
      }
    }

    generateTicket()
  }, [eventId])

  return (
    <div className="max-w-xl mx-auto p-6">
      <Card className="overflow-hidden shadow-lg border-t-4 border-t-primary-600">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl">Ticket Purchase</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 pb-8 flex flex-col items-center">
          {status === "processing" && (
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-50 text-primary-600 mb-2">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
              <p className="text-lg">{message}</p>
              <p className="text-sm text-muted-foreground">Please wait while we process your ticket...</p>
            </div>
          )}

          {status === "success" && (
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-50 text-green-600 mb-2">
                <CheckCircle className="h-8 w-8" />
              </div>
              <p className="text-lg font-medium text-green-700">{message}</p>
              <Alert className="bg-green-50 border-green-200 text-green-800 max-w-md mx-auto">
                <Ticket className="h-4 w-4" />
                <AlertTitle>Success!</AlertTitle>
                <AlertDescription>Your ticket is now available in your tickets list.</AlertDescription>
              </Alert>
            </div>
          )}

          {status === "error" && (
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 text-red-600 mb-2">
                <XCircle className="h-8 w-8" />
              </div>
              <p className="text-lg font-medium text-red-700">{message}</p>
              <Alert variant="destructive" className="max-w-md mx-auto">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  There was a problem creating your ticket. Please try again or contact support.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center gap-4 pt-2 pb-6">
          <Link to="/events">
            <Button variant="outline" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Events
            </Button>
          </Link>
          {status === "success" && (
            <Link to="/mytickets">
              <Button className="flex items-center bg-primary-600 hover:bg-primary-700">
                View My Tickets
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

export default TicketSuccess
