"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { Search, ArrowUpDown, Users, Clock, AlertCircle, ChevronRight } from "lucide-react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"

// Categories for filtering
const categories = [
  { id: "all", name: "All Categories" },
  { id: "medical", name: "Medical" },
  { id: "education", name: "Education" },
  { id: "community", name: "Community" },
  { id: "environment", name: "Environment" },
  { id: "animals", name: "Animals" },
  { id: "sports", name: "Sports" },
]

function FundraiserList() {
  const [fundraisers, setFundraisers] = useState([])
  const [filteredFundraisers, setFilteredFundraisers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [view, setView] = useState("grid")

  useEffect(() => {
    setLoading(true)
    axios
      .get("http://localhost:5000/fundraisers/with-progress")
      .then((res) => {
        // Add some sample categories if they don't exist in the data
        const enhancedData = res.data.map((fundraiser) => ({
          ...fundraiser,
          category: fundraiser.category || getRandomCategory(),
          supporters: fundraiser.supporters || Math.floor(Math.random() * 100) + 5,
          days_left: fundraiser.days_left || Math.floor(Math.random() * 30) + 1,
          created_at: fundraiser.created_at || new Date().toISOString(),
        }))
        setFundraisers(enhancedData)
        setFilteredFundraisers(enhancedData)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Failed to fetch fundraisers", err)
        setError("Failed to load fundraisers. Please try again later.")
        setLoading(false)
      })
  }, [])

  // Get a random category for demo purposes
  const getRandomCategory = () => {
    const categoryOptions = ["medical", "education", "community", "environment", "animals", "sports"]
    return categoryOptions[Math.floor(Math.random() * categoryOptions.length)]
  }

  // Apply filters and sorting
  useEffect(() => {
    let result = [...fundraisers]

    // Apply search filter
    if (searchQuery) {
      result = result.filter(
        (f) =>
          f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      result = result.filter((f) => f.category === selectedCategory)
    }

    // Apply sorting
    switch (sortBy) {
      case "newest":
        result = result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        break
      case "oldest":
        result = result.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
        break
      case "most-funded":
        result = result.sort((a, b) => b.collected_amount - a.collected_amount)
        break
      case "least-funded":
        result = result.sort((a, b) => a.collected_amount - b.collected_amount)
        break
      case "ending-soon":
        result = result.sort((a, b) => a.days_left - b.days_left)
        break
      default:
        break
    }

    setFilteredFundraisers(result)
  }, [fundraisers, searchQuery, selectedCategory, sortBy])

  // Handle donation submission
  const handleDonate = async (id, amount) => {
    try {
      const res = await axios.post(`http://localhost:5000/fundraisers/${id}/pay`, { amount }, { withCredentials: true })
      window.location.href = res.data.url // Redirect to Stripe
    } catch (err) {
      alert("Stripe error: " + (err.response?.data?.error || err.message))
    }
  }

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "usd",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Render loading skeletons
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-2 w-full mb-4" />
                <div className="flex justify-between mb-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-24" />
                </div>
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
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Fundraisers</h1>
          <p className="text-muted-foreground mt-1">Support causes that matter to you</p>
        </div>
        <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600">
          <Link to="/start-fundraiser">
            Start a Fundraiser
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="bg-muted/40 rounded-lg p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search fundraisers..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Categories</SelectLabel>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex gap-2">
                  <ArrowUpDown className="h-4 w-4" />
                  Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSortBy("newest")}>Newest</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("oldest")}>Oldest</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("most-funded")}>Most Funded</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("least-funded")}>Least Funded</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("ending-soon")}>Ending Soon</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Tabs value={view} onValueChange={setView} className="hidden md:block">
              <TabsList>
                <TabsTrigger value="grid" className="px-3">
                  <Grid className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="list" className="px-3">
                  <List className="h-4 w-4" />
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Active filters display */}
        {(searchQuery || selectedCategory !== "all") && (
          <div className="flex flex-wrap gap-2">
            {searchQuery && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Search: {searchQuery}
                <Button variant="ghost" size="icon" className="h-4 w-4 ml-1 p-0" onClick={() => setSearchQuery("")}>
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove</span>
                </Button>
              </Badge>
            )}
            {selectedCategory !== "all" && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Category: {categories.find((c) => c.id === selectedCategory)?.name}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 ml-1 p-0"
                  onClick={() => setSelectedCategory("all")}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove</span>
                </Button>
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("all")
              }}
            >
              Clear all
            </Button>
          </div>
        )}
      </div>

      {/* Results count */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-medium">{filteredFundraisers.length}</span> of{" "}
          <span className="font-medium">{fundraisers.length}</span> fundraisers
        </p>
      </div>

      {/* No results */}
      {filteredFundraisers.length === 0 && (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <Search className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">No fundraisers found</h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            We couldn't find any fundraisers matching your search criteria. Try adjusting your filters or search terms.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery("")
              setSelectedCategory("all")
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}

      {/* Grid View */}
      {view === "grid" && filteredFundraisers.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFundraisers.map((fundraiser) => {
            const percent = Math.min((fundraiser.collected_amount / fundraiser.goal_amount) * 100, 100)

            return (
              <Card key={fundraiser.id} className="overflow-hidden transition-all hover:shadow-md">
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={
                      fundraiser.image_url ||
                      "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=1000&auto=format&fit=crop"
                    }
                    alt={fundraiser.title}
                    className="object-cover w-full h-full transition-transform hover:scale-105"
                  />
                  <Badge className="absolute top-2 right-2 capitalize">{fundraiser.category}</Badge>
                </div>
                <CardHeader className="p-4 pb-0">
                  <CardTitle className="text-lg line-clamp-2">{fundraiser.title}</CardTitle>
                  <CardDescription className="flex items-center text-xs">
                    by {fundraiser.organizer || "Anonymous"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{fundraiser.description}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{formatCurrency(fundraiser.collected_amount)}</span>
                      <span className="text-muted-foreground">of {formatCurrency(fundraiser.goal_amount)}</span>
                    </div>
                    <Progress value={percent} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground pt-1">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{fundraiser.supporters} supporters</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{fundraiser.days_left} days left</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button asChild className="w-full" size="sm">
                    <Link to={`/fundraisers/${fundraiser.id}`}>Donate Now</Link>
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}

      {/* List View */}
      {view === "list" && filteredFundraisers.length > 0 && (
        <div className="space-y-4">
          {filteredFundraisers.map((fundraiser) => {
            const percent = Math.min((fundraiser.collected_amount / fundraiser.goal_amount) * 100, 100)

            return (
              <Card key={fundraiser.id} className="overflow-hidden transition-all hover:shadow-md">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3 lg:w-1/4 relative">
                    <img
                      src={
                        fundraiser.image_url ||
                        "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=1000&auto=format&fit=crop"
                      }
                      alt={fundraiser.title}
                      className="object-cover w-full h-full md:h-48 lg:h-full"
                    />
                    <Badge className="absolute top-2 right-2 capitalize">{fundraiser.category}</Badge>
                  </div>
                  <div className="md:w-2/3 lg:w-3/4 p-4 flex flex-col">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-1">{fundraiser.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">by {fundraiser.organizer || "Anonymous"}</p>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{fundraiser.description}</p>
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{formatCurrency(fundraiser.collected_amount)}</span>
                          <span className="text-muted-foreground">of {formatCurrency(fundraiser.goal_amount)}</span>
                        </div>
                        <Progress value={percent} className="h-2" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span>{fundraiser.supporters} supporters</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{fundraiser.days_left} days left</span>
                        </div>
                      </div>
                      <Button asChild size="sm">
                        <Link to={`/fundraisers/${fundraiser.id}`}>Donate Now</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

// Missing component imports
function Grid(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="7" height="7" x="3" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="14" rx="1" />
      <rect width="7" height="7" x="3" y="14" rx="1" />
    </svg>
  )
}

function List(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="8" x2="21" y1="6" y2="6" />
      <line x1="8" x2="21" y1="12" y2="12" />
      <line x1="8" x2="21" y1="18" y2="18" />
      <line x1="3" x2="3.01" y1="6" y2="6" />
      <line x1="3" x2="3.01" y1="12" y2="12" />
      <line x1="3" x2="3.01" y1="18" y2="18" />
    </svg>
  )
}

function X(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}

export default FundraiserList
