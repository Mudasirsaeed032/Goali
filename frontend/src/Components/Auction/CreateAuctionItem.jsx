"use client"

import { useState } from "react"
import axios from "axios"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import { ArrowLeft, Calendar, Info, Loader2, AlertCircle, ImagePlus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"

function CreateAuctionItem({ user }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm()
  const navigate = useNavigate()

  const [image, setImage] = useState(null)
  const [imageURL, setImageURL] = useState("")
  const [imagePreview, setImagePreview] = useState("")
  const [error, setError] = useState("")

  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      setImagePreview(URL.createObjectURL(file))

      // Here you would typically upload the image to your server or cloud storage
      // and get back a URL. For this example, we'll just use the preview URL.
      setImageURL(URL.createObjectURL(file))
    }
  }

  // Clear image
  const clearImage = () => {
    setImage(null)
    setImagePreview("")
    setImageURL("")
  }

  const onSubmit = async (data) => {
    try {
      setError("")

      if (!imageURL) {
        setError("Please upload an image for the auction item")
        return
      }

      const auctionItemData = {
        title: data.title,
        description: data.description,
        starting_bid: Number.parseFloat(data.starting_bid) || 0,
        current_bid: Number.parseFloat(data.starting_bid) || 0,
        start_time: data.start_time,
        end_time: data.end_time,
        image_url: imageURL,
        owner_id: user?.id,
      }

      await axios.post("http://localhost:5000/auction", auctionItemData, {
        withCredentials: true,
      })

      navigate("/auction")
    } catch (error) {
      console.error("Error creating auction item:", error)
      setError(error.response?.data?.error || "Failed to create auction item. Please try again.")
    }
  }

  // Get min date for start time (now)
  const getMinStartDate = () => {
    const now = new Date()
    return now.toISOString().slice(0, 16) // Format: YYYY-MM-DDTHH:MM
  }

  // Get min date for end time (based on start time)
  const startTime = watch("start_time")
  const getMinEndDate = () => {
    if (!startTime) return getMinStartDate()

    const start = new Date(startTime)
    // Add at least 1 hour to start time
    start.setHours(start.getHours() + 1)
    return start.toISOString().slice(0, 16)
  }

  if (!user) {
    return (
      <div className="max-w-xl mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Authentication Required</AlertTitle>
          <AlertDescription>You must be logged in to create an auction.</AlertDescription>
        </Alert>
        <div className="mt-4 text-center">
          <Button asChild>
            <Link to="/login">Login</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="gap-1">
          <Link to="/auction">
            <ArrowLeft className="h-4 w-4" />
            Back to Auctions
          </Link>
        </Button>
      </div>

      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Create Auction Item</CardTitle>
          <CardDescription>Fill in the details to list your item for auction</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Auction Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="Enter a descriptive title"
                  {...register("title", { required: "Title is required" })}
                  className={errors.title ? "border-red-500" : ""}
                />
                {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Provide details about your auction item"
                  rows={4}
                  {...register("description", { required: "Description is required" })}
                  className={errors.description ? "border-red-500" : ""}
                />
                {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="starting_bid">
                  Starting Bid ($) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="starting_bid"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  {...register("starting_bid", { required: "Starting bid is required" })}
                  className={errors.starting_bid ? "border-red-500" : ""}
                />
                {errors.starting_bid && <p className="text-red-500 text-sm">{errors.starting_bid.message}</p>}
              </div>
            </div>

            <Separator />

            {/* Auction Timing */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Auction Schedule</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_time" className="flex items-center gap-1">
                    Start Time <span className="text-red-500">*</span>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="start_time"
                      type="datetime-local"
                      min={getMinStartDate()}
                      className="pl-10"
                      {...register("start_time", { required: "Start time is required" })}
                    />
                  </div>
                  {errors.start_time && <p className="text-red-500 text-sm">{errors.start_time.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end_time" className="flex items-center gap-1">
                    End Time <span className="text-red-500">*</span>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="end_time"
                      type="datetime-local"
                      min={getMinEndDate()}
                      className="pl-10"
                      {...register("end_time", { required: "End time is required" })}
                    />
                  </div>
                  {errors.end_time && <p className="text-red-500 text-sm">{errors.end_time.message}</p>}
                </div>
              </div>
            </div>

            <Separator />

            {/* Image Upload */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Item Image</h3>
              <div className="space-y-2">
                <Label htmlFor="image">
                  Upload Image <span className="text-red-500">*</span>
                </Label>

                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Preview"
                      className="w-full h-64 object-cover rounded-lg border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={clearImage}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div
                    className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => document.getElementById("image").click()}
                  >
                    <ImagePlus className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground mb-1">Click to upload an image</p>
                    <p className="text-xs text-muted-foreground">PNG, JPG or GIF (max 5MB)</p>
                  </div>
                )}

                <Input id="image" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Auction"
                )}
              </Button>
              <Button type="button" variant="outline" className="flex-1" onClick={() => navigate("/auction")}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default CreateAuctionItem
