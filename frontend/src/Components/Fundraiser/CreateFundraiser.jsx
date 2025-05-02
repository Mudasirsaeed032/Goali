"use client"

import { useState } from "react"
import axios from "axios"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { DollarSign, Upload, ArrowLeft, Loader2, ImageIcon, Target, Info, CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"

function CreateFundraiser({ user }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const [image, setImage] = useState(null)
  const [imageURL, setImageURL] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const watchedGoalAmount = watch("goal_amount", "")

  // Handle Image Upload to Cloudinary
  const handleImageUpload = async (file) => {
    if (!file) return null

    setUploadingImage(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("upload_preset", "unsigned-goali")
      const cloudName = "dgvc3mvc5"

      const response = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, formData)
      setUploadingImage(false)
      return response.data.secure_url
    } catch (err) {
      console.error("Image upload failed:", err)
      setError("Failed to upload image. Please try again.")
      setUploadingImage(false)
      return null
    }
  }

  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    setImage(file)

    // Create a preview URL
    const reader = new FileReader()
    reader.onloadend = () => {
      setImageURL(reader.result)
    }
    reader.readAsDataURL(file)
  }

  // Form Submission Handler
  const onSubmit = async (data) => {
    setLoading(true)
    setError(null)

    try {
      let uploadedImageURL = imageURL

      // If there's a file but no cloudinary URL yet
      if (image && !imageURL.startsWith("http")) {
        uploadedImageURL = await handleImageUpload(image)
        if (!uploadedImageURL) {
          setLoading(false)
          return
        }
        setImageURL(uploadedImageURL)
      }

      const fundraiserData = {
        title: data.title,
        description: description,
        image_url: uploadedImageURL,
        goal_amount: Number.parseFloat(data.goal_amount),
        collected_amount: 0,
        owner_id: user?.id,
      }

      await axios.post("http://localhost:5000/fundraisers", fundraiserData, {
        withCredentials: true,
      })

      setSuccess(true)
      setTimeout(() => {
        navigate("/admin/fundraisers")
      }, 2000)
    } catch (err) {
      console.error("Failed to create fundraiser:", err)
      setError(err.response?.data?.message || "Failed to create fundraiser. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount) return "₹0"
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "usd",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <Link
          to="/admin/fundraisers"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-2"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Fundraisers
        </Link>
        <h1 className="text-3xl font-bold flex items-center">
          <DollarSign className="mr-2 h-7 w-7 text-primary-600" />
          Create Fundraiser
        </h1>
        <p className="text-muted-foreground mt-1">Create a new fundraising campaign</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <Info className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-50 border-green-200 text-green-800">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>Your fundraiser has been created. Redirecting to fundraisers page...</AlertDescription>
        </Alert>
      )}

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Fundraiser Details</CardTitle>
          <CardDescription>Fill in the details to create your fundraising campaign</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="flex items-center">
                  <Info className="h-4 w-4 mr-2 text-muted-foreground" />
                  Fundraiser Title
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
                  <Info className="h-4 w-4 mr-2 text-muted-foreground" />
                  Fundraiser Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe your fundraiser in detail"
                  className={`min-h-[120px]`}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="goal_amount" className="flex items-center">
                  <Target className="h-4 w-4 mr-2 text-muted-foreground" />
                  Goal Amount ($)
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                  <Input
                    id="goal_amount"
                    type="number"
                    placeholder="0"
                    className={`pl-8 ${errors.goal_amount ? "border-red-500" : ""}`}
                    {...register("goal_amount", {
                      required: "Goal amount is required",
                      valueAsNumber: true,
                      min: { value: 1, message: "Must be at least ₹1" },
                    })}
                  />
                </div>
                {errors.goal_amount && <p className="text-sm text-red-500 mt-1">{errors.goal_amount.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="image" className="flex items-center">
                  <ImageIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                  Fundraiser Image
                </Label>
                <div className="border-2 border-dashed rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                  <Input id="image" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  <Label htmlFor="image" className="flex flex-col items-center justify-center cursor-pointer">
                    {imageURL ? (
                      <div className="relative w-full">
                        <img
                          src={imageURL || "/placeholder.svg"}
                          alt="Fundraiser preview"
                          className="h-48 w-full object-cover rounded-md"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-md">
                          <p className="text-white text-sm font-medium">Change Image</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-4">
                        <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                        <p className="text-sm font-medium">Click to upload or drag and drop</p>
                        <p className="text-xs text-muted-foreground mt-1">SVG, PNG, JPG or GIF (max. 2MB)</p>
                      </div>
                    )}
                  </Label>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <div className="bg-muted/40 p-4 rounded-lg w-full">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <p className="font-medium">Preview</p>
                  <p className="text-sm text-muted-foreground">Goal amount:</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-primary-700">{formatCurrency(watchedGoalAmount)}</p>
                </div>
              </div>
              <Progress value={0} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                0% Complete (₹0 of {formatCurrency(watchedGoalAmount)})
              </p>
            </div>

            <div className="flex gap-3 w-full">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => navigate("/admin/fundraisers")}
                disabled={loading || uploadingImage}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700"
                disabled={loading || uploadingImage}
              >
                {loading || uploadingImage ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {uploadingImage ? "Uploading Image..." : "Creating Fundraiser..."}
                  </>
                ) : (
                  "Create Fundraiser"
                )}
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

export default CreateFundraiser
