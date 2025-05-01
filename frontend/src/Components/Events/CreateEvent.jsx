"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { MapPinIcon, TicketIcon, InfoIcon, ArrowLeft, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"

function CreateEvent({ user }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    if (!user || !user.id) {
      setError("You must be logged in to create an event.")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await axios.post("http://localhost:5000/events", data, {
        withCredentials: true,
      })
      setSuccess(true)
      setTimeout(() => {
        navigate("/events")
      }, 2000)
    } catch (error) {
      console.error("Error creating event:", error.response?.data || error.message)
      setError(error.response?.data?.message || "Failed to create event. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const watchedPrice = watch("price", "")

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-6">
        <Button variant="ghost" className="mb-4" onClick={() => navigate("/events")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Events
        </Button>
        <h1 className="text-3xl font-bold">Create New Event</h1>
        <p className="text-muted-foreground mt-1">Fill in the details to create your event</p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-6 bg-green-50 border-green-200 text-green-800">
          <div className="h-4 w-4 rounded-full bg-green-500" />
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>Your event has been created. Redirecting to events page...</AlertDescription>
        </Alert>
      )}

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Event Details</CardTitle>
          <CardDescription>Create a new event for your audience. All fields are required.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="flex items-center">
                  <InfoIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                  Event Title
                </Label>
                <Input
                  id="title"
                  placeholder="Enter a descriptive title"
                  {...register("title", { required: "Title is required" })}
                  className={errors.title ? "border-red-500" : ""}
                />
                {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="flex items-center">
                  <InfoIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                  Event Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe your event in detail"
                  className={`min-h-[120px] ${errors.description ? "border-red-500" : ""}`}
                  {...register("description", { required: "Description is required" })}
                />
                {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>}
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="price" className="flex items-center">
                  <TicketIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                  Ticket Price (₹)
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2">₹</span>
                  <Input
                    id="price"
                    type="number"
                    placeholder="0"
                    className={`pl-8 ${errors.price ? "border-red-500" : ""}`}
                    {...register("price", {
                      required: "Price is required",
                      valueAsNumber: true,
                      min: { value: 0, message: "Price cannot be negative" },
                    })}
                  />
                </div>
                {errors.price && <p className="text-sm text-red-500 mt-1">{errors.price.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="flex items-center">
                  <MapPinIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                  Location
                </Label>
                <Input
                  id="location"
                  placeholder="Physical location or online link"
                  className={errors.location ? "border-red-500" : ""}
                  {...register("location", { required: "Location is required" })}
                />
                {errors.location && <p className="text-sm text-red-500 mt-1">{errors.location.message}</p>}
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <div className="bg-muted/40 p-4 rounded-lg w-full">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Preview</p>
                  <p className="text-sm text-muted-foreground">Ticket price:</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-primary-700">₹{watchedPrice || "0"}</p>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Event...
                </>
              ) : (
                "Create Event"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

export default CreateEvent
