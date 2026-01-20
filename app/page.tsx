import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { DollarSign, Users, TrendingUp, Calendar, CreditCard, BarChart3, Bell, Shield, Zap, Check } from 'lucide-react'

export default function Home() {
  const features = [
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: "Automated Dues Collection",
      description: "Set up recurring payments, send automated reminders, and track who's paid with real-time dashboards. Members can pay via card, bank transfer, or payment plans."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Member Management",
      description: "Centralized directory with roles, status tracking, attendance logs, and custom fields. Onboard new members seamlessly and manage alumni networks."
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Fundraising Tools",
      description: "Launch campaigns with custom donation pages, track progress in real-time, and offer tiered giving levels. Perfect for events, philanthropies, and capital projects."
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Financial Reporting",
      description: "Generate instant reports on income, expenses, and budget tracking. Export to your accountant or university admin with one click. Full audit trails included."
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Event Management",
      description: "Sell tickets, manage RSVPs, and collect payments for formals, mixers, and socials. Integrated check-in and capacity management."
    },
    {
      icon: <Bell className="w-8 h-8" />,
      title: "Smart Notifications",
      description: "Automated payment reminders, upcoming event alerts, and custom announcements. Keep everyone informed via email and SMS."
    }
  ]

  const additionalFeatures = [
    "Stripe integration for secure bank account linking",
    "Multi-tier access controls (President, Treasurer, Member)",
    "Budget allocation and expense tracking by category",
    "Payment history and receipt generation",
    "Late fee automation and flexible payment plans",
    "Integration with Venmo and other popular payment methods",
    "Mobile-responsive dashboard for on-the-go management",
    "Bulk invoicing and custom payment schedules"
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#448bfc] via-[#2563eb] to-[#1e40af]">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center space-y-8">
            <div className="inline-block">
              <h1 className="text-7xl lg:text-8xl font-extrabold text-white mb-2 tracking-tight">
                Guild
              </h1>
              <div className="h-2 bg-gradient-to-r from-[#60a5fa] to-[#93c5fd] rounded-full"></div>
            </div>
            
            <p className="text-2xl lg:text-3xl text-white font-light max-w-3xl mx-auto leading-relaxed">
              An all-in-one membership management platform for modern organizations
            </p>
            
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">
              Collect dues, manage members, run fundraisers, and track finances-all in one beautiful dashboard
            </p>
            
            <div className="flex gap-4 justify-center pt-6 flex-wrap">
              <Link href="/signup">
                <Button size="lg" className="bg-white text-[#448bfc] hover:bg-gray-100 text-lg px-8 py-6 rounded-full shadow-xl hover:shadow-2xl transition-all">
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="border-2 border-white text-black hover:bg-white hover:text-[#448bfc] text-lg px-8 py-6 rounded-full transition-all">
                  Sign In
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-center gap-8 pt-8 text-white text-sm">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5" />
                <span>Free for 30 days</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5" />
                <span>Setup in minutes</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Bar */}
      <div className="bg-blue-50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
            <Shield className="w-5 h-5 text-[#448bfc]" />
            <span className="font-medium">Bank-level security with Stripe</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">Trusted by 500+ organizations</span>
            <span className="hidden md:inline">•</span>
            <span className="hidden md:inline">$10M+ processed annually</span>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Everything your organization needs
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Purpose-built for communities and organizations, with features designed to save you hours every week
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group p-8 rounded-2xl border-2 border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300 bg-white"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-[#448bfc] to-[#2563eb] rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Features */}
      <div className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              And so much more
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {additionalFeatures.map((feature, index) => (
              <div key={index} className="flex items-start gap-3 p-4">
                <Zap className="w-6 h-6 text-[#448bfc] flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-gradient-to-br from-[#448bfc] to-[#2563eb]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to simplify your finances?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join hundreds of organizations that have ditched spreadsheets and switched to Guild
          </p>
          <Link href="/signup">
            <Button size="lg" className="bg-white text-[#448bfc] hover:bg-gray-100 text-lg px-12 py-6 rounded-full shadow-xl hover:shadow-2xl transition-all">
              Get Started Free
            </Button>
          </Link>
          <p className="text-blue-200 mt-6 text-sm">
            No credit card required • Cancel anytime
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm">© 2025 Guild. Secure payments powered by Stripe.</p>
        </div>
      </footer>
    </div>
  )
}