"use client"

import { useEffect, useState } from "react"
import { Outlet } from "react-router-dom"
import axios from "axios"
import Navbar from "../Navbar/Navbar"
import { CalendarDays, Mail, MapPin, Phone } from "lucide-react"

function Layout() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios
      .get("http://localhost:5000/protected", { withCredentials: true })
      .then((res) => {
        setUser(res.data.user)
        setLoading(false)
      })
      .catch(() => {
        setUser(null)
        setLoading(false)
      })
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <Navbar user={user} setUser={setUser} />

      {/* Page Loading State */}
      {loading ? (
        <div className="flex flex-1 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : (
        <>
          {/* Main Content */}
          <main className="flex-1 container mx-auto px-4 py-8 md:px-6 md:py-12">
            <Outlet context={{ user }} />
          </main>

          {/* Footer */}
          <footer className="border-t border-gray-200 bg-white">
            <div className="container mx-auto px-4 py-12 md:px-6">
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                {/* Brand */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
                      <span className="text-lg font-bold text-white">G</span>
                    </div>
                    <span className="text-xl font-bold text-primary">Goali</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">
                    Your one-stop platform for discovering, creating, and managing events and fundraisers.
                  </p>
                  <div className="flex space-x-4">
                    <a href="#" className="rounded-full bg-primary/10 p-2 text-primary hover:bg-primary/20">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path
                          fillRule="evenodd"
                          d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                    <a href="#" className="rounded-full bg-primary/10 p-2 text-primary hover:bg-primary/20">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </a>
                    <a href="#" className="rounded-full bg-primary/10 p-2 text-primary hover:bg-primary/20">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path
                          fillRule="evenodd"
                          d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                  </div>
                </div>

                {/* Quick Links */}
                <div>
                  <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-900">Quick Links</h3>
                  <ul className="space-y-2">
                    <li>
                      <a href="/" className="text-gray-600 hover:text-primary">
                        Home
                      </a>
                    </li>
                    <li>
                      <a href="/events" className="text-gray-600 hover:text-primary">
                        Events
                      </a>
                    </li>
                    <li>
                      <a href="/fundraisers" className="text-gray-600 hover:text-primary">
                        Fundraisers
                      </a>
                    </li>
                    <li>
                      <a href="/mytickets" className="text-gray-600 hover:text-primary">
                        My Tickets
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Resources */}
                <div>
                  <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-900">Resources</h3>
                  <ul className="space-y-2">
                    <li>
                      <a href="/about" className="text-gray-600 hover:text-primary">
                        About Us
                      </a>
                    </li>
                    <li>
                      <a href="/faq" className="text-gray-600 hover:text-primary">
                        FAQ
                      </a>
                    </li>
                    <li>
                      <a href="/privacy" className="text-gray-600 hover:text-primary">
                        Privacy Policy
                      </a>
                    </li>
                    <li>
                      <a href="/terms" className="text-gray-600 hover:text-primary">
                        Terms of Service
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Contact */}
                <div>
                  <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-900">Contact</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <MapPin className="mr-2 h-5 w-5 text-secondary" />
                      <span className="text-gray-600">123 Event Street, City, Country</span>
                    </li>
                    <li className="flex items-center">
                      <Phone className="mr-2 h-5 w-5 text-secondary" />
                      <a href="tel:+1234567890" className="text-gray-600 hover:text-primary">
                        +1 (234) 567-890
                      </a>
                    </li>
                    <li className="flex items-center">
                      <Mail className="mr-2 h-5 w-5 text-secondary" />
                      <a href="mailto:info@eventhub.com" className="text-gray-600 hover:text-primary">
                        info@eventhub.com
                      </a>
                    </li>
                    <li className="flex items-center">
                      <CalendarDays className="mr-2 h-5 w-5 text-secondary" />
                      <span className="text-gray-600">Mon-Fri: 9AM - 5PM</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Bottom Bar */}
              <div className="mt-12 border-t border-gray-200 pt-8">
                <p className="text-center text-sm text-gray-500">
                  © {new Date().getFullYear()} EventHub. All rights reserved.
                </p>
              </div>
            </div>
          </footer>
        </>
      )}
    </div>
  )
}

export default Layout
