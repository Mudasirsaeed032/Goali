import { Link } from "react-router-dom"
import { Users, Calendar, DollarSign, Gavel, LayoutDashboard, Settings, BarChart3 } from 'lucide-react'

import { Card, CardContent } from "@/components/ui/card"

function AdminDashboard() {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <LayoutDashboard className="mr-2 h-8 w-8 text-primary-600" />
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">Manage your platform's content and users</p>
        </div>
        <Link to="/admin/settings">
          <div className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
            <Settings className="mr-1 h-4 w-4" />
            System Settings
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Analytics Summary Cards */}
        <Card className="bg-muted/30">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Users</p>
              <p className="text-2xl font-bold">1,234</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary-50 flex items-center justify-center">
              <Users className="h-6 w-6 text-primary-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-muted/30">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Events</p>
              <p className="text-2xl font-bold">42</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-secondary-50 flex items-center justify-center">
              <Calendar className="h-6 w-6 text-secondary-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-muted/30">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Fundraisers</p>
              <p className="text-2xl font-bold">18</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-50 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-muted/30">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Auctions</p>
              <p className="text-2xl font-bold">7</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-amber-50 flex items-center justify-center">
              <Gavel className="h-6 w-6 text-amber-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-xl font-semibold mt-8 mb-4">Management</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link to="/admin/fundraisers" className="block">
          <Card className="h-full transition-all hover:shadow-md hover:border-primary-200 cursor-pointer">
            <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
              <div className="h-12 w-12 rounded-full bg-green-50 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium">Manage Fundraisers</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Create, edit and track fundraising campaigns
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/admin/auctions" className="block">
          <Card className="h-full transition-all hover:shadow-md hover:border-primary-200 cursor-pointer">
            <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
              <div className="h-12 w-12 rounded-full bg-amber-50 flex items-center justify-center">
                <Gavel className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <h3 className="font-medium">Manage Auctions</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Create and monitor auction listings
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/admin/events" className="block">
          <Card className="h-full transition-all hover:shadow-md hover:border-primary-200 cursor-pointer">
            <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
              <div className="h-12 w-12 rounded-full bg-secondary-50 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-secondary-600" />
              </div>
              <div>
                <h3 className="font-medium">Manage Events</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Create and manage event listings and tickets
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/admin/users" className="block">
          <Card className="h-full transition-all hover:shadow-md hover:border-primary-200 cursor-pointer">
            <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
              <div className="h-12 w-12 rounded-full bg-primary-50 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h3 className="font-medium">Manage Users</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  View and manage user accounts
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="mt-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium flex items-center">
                <BarChart3 className="mr-2 h-5 w-5 text-muted-foreground" />
                Recent Activity
              </h3>
              <Link to="/admin/activity" className="text-sm text-primary-600 hover:underline">
                View All
              </Link>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                  <span>New fundraiser created</span>
                </div>
                <span className="text-sm text-muted-foreground">2 hours ago</span>
              </div>
              
              <div className="flex items-center justify-between py-2 border-b">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div>
                  <span>Auction ended</span>
                </div>
                <span className="text-sm text-muted-foreground">5 hours ago</span>
              </div>
              
              <div className="flex items-center justify-between py-2 border-b">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-secondary-500 mr-2"></div>
                  <span>New event created</span>
                </div>
                <span className="text-sm text-muted-foreground">Yesterday</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AdminDashboard
