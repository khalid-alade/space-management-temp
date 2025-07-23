import { Wifi, Coffee, Calendar, Users, Shield, CreditCard } from "lucide-react"

export function Features() {
  const features = [
    {
      icon: <Wifi className="h-6 w-6 text-primary" />,
      title: "High-Speed Internet",
      description: "Enjoy lightning-fast, reliable internet connectivity throughout all our spaces.",
    },
    {
      icon: <Coffee className="h-6 w-6 text-primary" />,
      title: "Complimentary Refreshments",
      description: "Free coffee, tea, and water to keep you energized throughout your workday.",
    },
    {
      icon: <Calendar className="h-6 w-6 text-primary" />,
      title: "Flexible Booking",
      description: "Book daily or monthly with no long-term commitments required.",
    },
    {
      icon: <Users className="h-6 w-6 text-primary" />,
      title: "Community Events",
      description: "Regular networking events and workshops to connect with like-minded professionals.",
    },
    {
      icon: <Shield className="h-6 w-6 text-primary" />,
      title: "24/7 Security",
      description: "Secure access and round-the-clock surveillance for your peace of mind.",
    },
    {
      icon: <CreditCard className="h-6 w-6 text-primary" />,
      title: "Easy Payments",
      description: "Simple, transparent pricing with multiple payment options available.",
    },
  ]

  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Everything You Need to Succeed
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Our spaces are designed to provide the perfect environment for productivity and collaboration.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center space-y-2 rounded-lg border bg-background p-4 text-center"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full border bg-background">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
