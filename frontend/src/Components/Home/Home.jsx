"use client"

import { useOutletContext } from "react-router-dom"
import { Link } from "react-router-dom"
import {
  Target,
  User,
  Mail,
  Shield,
  ChevronRight,
  Info,
  Heart,
  Calendar,
  TrendingUp,
  Award,
  Users,
  Search,
  ArrowRight,
  Clock,
  DollarSign,
  Zap,
  CheckCircle,
  Globe,
  HandHeart,
} from "lucide-react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Sample data for featured fundraisers
const featuredFundraisers = [
  {
    id: 1,
    title: "Help Build a Community Garden",
    category: "Community",
    image: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=1000&auto=format&fit=crop",
    raised: 8750,
    goal: 10000,
    daysLeft: 12,
    supporters: 124,
    organizer: "Sarah Johnson",
  },
  {
    id: 2,
    title: "Medical Treatment for Alex",
    category: "Medical",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1000&auto=format&fit=crop",
    raised: 15200,
    goal: 25000,
    daysLeft: 8,
    supporters: 213,
    organizer: "Michael Chen",
  },
  {
    id: 3,
    title: "Local School Music Program",
    category: "Education",
    image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?q=80&w=1000&auto=format&fit=crop",
    raised: 4300,
    goal: 7500,
    daysLeft: 15,
    supporters: 87,
    organizer: "Emma Rodriguez",
  },
]

// Sample data for upcoming events
const upcomingEvents = [
  {
    id: 1,
    title: "Charity Gala Dinner",
    category: "Gala",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1000&auto=format&fit=crop",
    date: "June 15, 2023",
    location: "Grand Hotel",
    price: "$75",
    organizer: "Community Foundation",
  },
  {
    id: 2,
    title: "5K Run for a Cause",
    category: "Sports",
    image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=1000&auto=format&fit=crop",
    date: "July 8, 2023",
    location: "City Park",
    price: "$25",
    organizer: "Health Alliance",
  },
  {
    id: 3,
    title: "Art Auction Night",
    category: "Arts",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1000&auto=format&fit=crop",
    date: "June 22, 2023",
    location: "Modern Art Gallery",
    price: "Free Entry",
    organizer: "Artists Collective",
  },
]

// Sample categories
const categories = [
  { name: "Medical", icon: <Heart className="h-5 w-5" />, color: "bg-red-100 text-red-600" },
  { name: "Education", icon: <Award className="h-5 w-5" />, color: "bg-blue-100 text-blue-600" },
  { name: "Community", icon: <Users className="h-5 w-5" />, color: "bg-green-100 text-green-600" },
  { name: "Environment", icon: <Globe className="h-5 w-5" />, color: "bg-emerald-100 text-emerald-600" },
  { name: "Animals", icon: <HandHeart className="h-5 w-5" />, color: "bg-amber-100 text-amber-600" },
  { name: "Sports", icon: <Target className="h-5 w-5" />, color: "bg-purple-100 text-purple-600" },
]

// Sample impact statistics
const impactStats = [
  { value: "$2.5M+", label: "Raised", icon: <DollarSign className="h-5 w-5" /> },
  { value: "350+", label: "Fundraisers", icon: <Heart className="h-5 w-5" /> },
  { value: "15K+", label: "Donors", icon: <Users className="h-5 w-5" /> },
  { value: "98%", label: "Success Rate", icon: <TrendingUp className="h-5 w-5" /> },
]

// Sample testimonials
const testimonials = [
  {
    quote: "GOALI helped me raise funds for my daughter's medical treatment in just two weeks. Forever grateful!",
    name: "Rebecca Thompson",
    role: "Parent",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000&auto=format&fit=crop",
  },
  {
    quote: "Our school was able to fund a new computer lab thanks to the amazing support we received through GOALI.",
    name: "David Martinez",
    role: "School Principal",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop",
  },
  {
    quote:
      "The platform is so easy to use and the team provides incredible support throughout the fundraising process.",
    name: "Jennifer Lee",
    role: "Nonprofit Director",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1000&auto=format&fit=crop",
  },
]

// Fundraiser card component
function FundraiserCard({ fundraiser }) {
  const percentRaised = Math.min(100, Math.round((fundraiser.raised / fundraiser.goal) * 100))

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="aspect-video relative overflow-hidden">
        <img
          src={fundraiser.image || "/placeholder.svg"}
          alt={fundraiser.title}
          className="object-cover w-full h-full transition-transform hover:scale-105"
        />
        <Badge className="absolute top-2 right-2">{fundraiser.category}</Badge>
      </div>
      <CardHeader className="p-4 pb-0">
        <CardTitle className="text-lg line-clamp-2">{fundraiser.title}</CardTitle>
        <CardDescription className="flex items-center text-xs">by {fundraiser.organizer}</CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">${fundraiser.raised.toLocaleString()}</span>
            <span className="text-muted-foreground">of ${fundraiser.goal.toLocaleString()}</span>
          </div>
          <Progress value={percentRaised} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground pt-1">
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>{fundraiser.supporters} supporters</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{fundraiser.daysLeft} days left</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full" size="sm">
          <Link to={`/fundraiser/${fundraiser.id}`}>Donate Now</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

// Event card component
function EventCard({ event }) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="aspect-video relative overflow-hidden">
        <img
          src={event.image || "/placeholder.svg"}
          alt={event.title}
          className="object-cover w-full h-full transition-transform hover:scale-105"
        />
        <Badge variant="secondary" className="absolute top-2 right-2">
          {event.category}
        </Badge>
      </div>
      <CardHeader className="p-4 pb-0">
        <CardTitle className="text-lg line-clamp-2">{event.title}</CardTitle>
        <CardDescription className="flex items-center text-xs">by {event.organizer}</CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Target className="h-4 w-4 text-muted-foreground" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span>{event.price}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild variant="outline" className="w-full" size="sm">
          <Link to={`/event/${event.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

function Home() {
  const { user } = useOutletContext() || { user: null }

  return (
    <div className="space-y-12 pb-8 relative">
      {/* Full-page gradient background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500 opacity-[0.07]"></div>

      {/* Hero Section */}
      <section className="relative rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557682250-62777ba45e28?q=80&w=1000&auto=format&fit=crop')] mix-blend-overlay opacity-20 bg-cover bg-center"></div>
        <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
          <div className="grid md:grid-cols-2 gap-8 items-center relative z-10">
            <div className="space-y-6">
              <div className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-sm font-medium text-white">
                <Zap className="mr-1 h-3 w-3" />
                <span>Make a difference today</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
                THE VISION OF <span className="text-orange-400">GOALI</span>
              </h1>
              <p className="text-lg text-white/80 max-w-md">
                Create fundraisers, organize events, and connect with supporters to make your vision a reality.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-white/90">
                  <Link to="/start-fundraiser">
                    Start a Fundraiser
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                  <Link to="/browse">Browse Causes</Link>
                </Button>
              </div>
            </div>
            <div className="relative hidden md:block">
              <div className="rounded-full overflow-hidden h-80 w-80 ml-auto border-4 border-white/20 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1000&auto=format&fit=crop"
                  alt="Mountain landscape with purple hues"
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="absolute -bottom-4 left-0 bg-white rounded-lg p-4 shadow-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="font-medium">Trusted by 15,000+ users</span>
                </div>
              </div>
              <div className="absolute top-10 right-10">
                <div className="h-6 w-6 rounded-full bg-white/20 backdrop-blur-sm"></div>
              </div>
              <div className="absolute top-20 right-20">
                <div className="h-3 w-3 rounded-full bg-white/40 backdrop-blur-sm"></div>
              </div>
              <div className="absolute bottom-20 right-40">
                <div className="h-4 w-4 rounded-full border border-white/40"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* User Welcome Card (if logged in) */}
      {user && (
        <section>
          <Card className="border-none shadow-lg bg-gradient-to-r from-primary/5 to-secondary/5">
            <CardHeader className="text-center space-y-2">
              <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-3xl font-bold">Welcome back, {user.full_name.split(" ")[0]}!</CardTitle>
              <CardDescription className="text-base max-w-md mx-auto">
                Continue making an impact with GOALI. Your support matters.
              </CardDescription>
            </CardHeader>

            <Separator className="my-2" />

            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Full Name</p>
                      <p className="font-medium">{user.full_name}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">Account Type:</p>
                  <Badge variant={user.role === "admin" ? "default" : "secondary"} className="capitalize">
                    {user.role === "admin" ? <Shield className="h-3 w-3 mr-1" /> : null}
                    {user.role}
                  </Badge>
                </div>

                {user.role === "admin" && (
                  <Alert className="bg-amber-50 border-amber-200 text-amber-800">
                    <Shield className="h-4 w-4" />
                    <AlertTitle className="text-amber-800">Admin Access</AlertTitle>
                    <AlertDescription className="text-amber-700">
                      You have access to admin-only tools like user promotion and dashboard insights.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                  <Card className="bg-primary/5 border-none">
                    <CardContent className="p-4 text-center">
                      <h4 className="text-2xl font-bold">0</h4>
                      <p className="text-sm text-muted-foreground">Active Fundraisers</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-primary/5 border-none">
                    <CardContent className="p-4 text-center">
                      <h4 className="text-2xl font-bold">0</h4>
                      <p className="text-sm text-muted-foreground">Donations Made</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-primary/5 border-none">
                    <CardContent className="p-4 text-center">
                      <h4 className="text-2xl font-bold">0</h4>
                      <p className="text-sm text-muted-foreground">Events Attended</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-primary/5 border-none">
                    <CardContent className="p-4 text-center">
                      <h4 className="text-2xl font-bold">$0</h4>
                      <p className="text-sm text-muted-foreground">Total Impact</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-center gap-4 pt-2 pb-6">
              <Button asChild>
                <Link to="/start-fundraiser">Start a Fundraiser</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/dashboard">View Dashboard</Link>
              </Button>
            </CardFooter>
          </Card>
        </section>
      )}

      {/* Search Section */}
      <section className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for fundraisers, events, or causes..."
              className="pl-10 h-12 rounded-full"
            />
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Browse by Category</h2>
          <p className="text-muted-foreground">Find causes that matter to you</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => (
            <Link to={`/category/${category.name.toLowerCase()}`} key={index}>
              <Card className="text-center hover:shadow-md transition-all border-none">
                <CardContent className="p-4">
                  <div
                    className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-3 ${category.color}`}
                  >
                    {category.icon}
                  </div>
                  <h3 className="font-medium">{category.name}</h3>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Impact Statistics */}
      <section className="bg-primary/5 py-12 rounded-2xl">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Our Impact</h2>
            <p className="text-muted-foreground">Together we're making a difference</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {impactStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="bg-white h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <div className="text-primary">{stat.icon}</div>
                </div>
                <h3 className="text-2xl font-bold">{stat.value}</h3>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Content Tabs */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Discover</h2>
          <p className="text-muted-foreground">Explore fundraisers and events</p>
        </div>

        <Tabs defaultValue="fundraisers" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="fundraisers">Fundraisers</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
          </TabsList>

          <TabsContent value="fundraisers" className="mt-0">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredFundraisers.map((fundraiser) => (
                <FundraiserCard key={fundraiser.id} fundraiser={fundraiser} />
              ))}
            </div>
            <div className="text-center mt-8">
              <Button asChild variant="outline">
                <Link to="/fundraisers">
                  View All Fundraisers
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="events" className="mt-0">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
            <div className="text-center mt-8">
              <Button asChild variant="outline">
                <Link to="/events">
                  View All Events
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">How GOALI Works</h2>
          <p className="text-muted-foreground">Simple steps to start making a difference</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border-none shadow-sm bg-primary/5">
            <CardContent className="pt-6">
              <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-primary" />
                <span className="sr-only">Create</span>
              </div>
              <h3 className="text-lg font-medium mb-2">1. Create</h3>
              <p className="text-muted-foreground">
                Set up your fundraiser or event in minutes. Add photos, tell your story, and set your goal.
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-primary/5">
            <CardContent className="pt-6">
              <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                <Share className="h-6 w-6 text-primary" />
                <span className="sr-only">Share</span>
              </div>
              <h3 className="text-lg font-medium mb-2">2. Share</h3>
              <p className="text-muted-foreground">
                Spread the word through social media, email, and messaging to reach potential supporters.
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-primary/5">
            <CardContent className="pt-6">
              <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-primary" />
                <span className="sr-only">Collect</span>
              </div>
              <h3 className="text-lg font-medium mb-2">3. Collect</h3>
              <p className="text-muted-foreground">
                Receive donations securely and track your progress. Withdraw funds easily when you need them.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <Button asChild>
            <Link to="/how-it-works">
              Learn More
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gradient-to-r from-primary/5 to-secondary/5 py-12 rounded-2xl">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Success Stories</h2>
            <p className="text-muted-foreground">Hear from people who achieved their goals with GOALI</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-none shadow-sm">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="italic mb-4">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                      <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4">
        <Card className="border-none shadow-lg bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500 text-white">
          <CardContent className="p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">Ready to achieve your goals?</h2>
                <p className="mb-6 text-primary-foreground/90">
                  Join thousands of others who are making a difference with GOALI. Start your fundraiser today.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button asChild variant="secondary" size="lg">
                    <Link to="/start-fundraiser">Start a Fundraiser</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="bg-transparent text-white border-white hover:bg-white/10"
                  >
                    <Link to="/contact">Contact Support</Link>
                  </Button>
                </div>
              </div>
              <div className="hidden md:block">
                <img
                  src="https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?q=80&w=1000&auto=format&fit=crop"
                  alt="People celebrating success"
                  className="rounded-lg"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Newsletter Section */}
      <section className="container mx-auto px-4">
        <Card className="border-none shadow-sm">
          <CardContent className="p-8">
            <div className="text-center max-w-md mx-auto">
              <h3 className="text-xl font-bold mb-2">Stay Updated</h3>
              <p className="text-muted-foreground mb-4">
                Subscribe to our newsletter for the latest fundraisers, events, and success stories.
              </p>
              <div className="flex gap-2">
                <Input type="email" placeholder="Your email address" className="h-10" />
                <Button>Subscribe</Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">We respect your privacy. Unsubscribe at any time.</p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Non-logged-in CTA (only shown if user is not logged in) */}
      {!user && (
        <section className="container mx-auto px-4">
          <div className="text-center space-y-6 py-4">
            <div className="bg-muted/50 p-6 rounded-lg max-w-md mx-auto">
              <Info className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Want to start your own fundraiser or join an auction?</h3>
              <p className="text-muted-foreground mb-6">
                Create an account to unlock all features and start making a difference today.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild variant="outline">
                  <Link to="/login">Log in</Link>
                </Button>
                <Button asChild>
                  <Link to="/signup">
                    Create an account
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="text-center pt-8">
        <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} GOALI. All rights reserved.</p>
      </footer>
    </div>
  )
}

// Missing component import
function Share(props) {
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
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" x2="12" y1="2" y2="15" />
    </svg>
  )
}

// Missing component import
function Star(props) {
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
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

export default Home
