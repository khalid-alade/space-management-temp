import type { Metadata } from "next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, MapPin, Calendar, Award } from "lucide-react"

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn more about Nithub and our mission to empower tech innovation in Nigeria",
}

export default function AboutPage() {
  const stats = [
    { label: "Active Members", value: "500+", icon: Users },
    { label: "Event Spaces", value: "8", icon: MapPin },
    { label: "Events Hosted", value: "1,200+", icon: Calendar },
    { label: "Years of Excellence", value: "5", icon: Award },
  ]

  const team = [
    {
      name: "Dr. Adebayo Adeyemi",
      role: "Executive Director",
      bio: "Leading tech innovation in Nigeria with over 15 years of experience in technology and entrepreneurship.",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      name: "Kemi Ogundimu",
      role: "Operations Manager",
      bio: "Ensuring smooth operations and exceptional member experience at all Nithub locations.",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      name: "Chidi Okwu",
      role: "Community Manager",
      bio: "Building and nurturing our vibrant tech community through events and networking opportunities.",
      image: "/placeholder.svg?height=200&width=200",
    },
  ]

  return (
    <div className="container mx-auto px-8 py-2 bg-muted/50">
      {/* Hero Section */}
      <section className="py-12 md:py-16 lg:py-20">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">About Nithub</h1>
          <p className="max-w-3xl mx-auto text-lg text-muted-foreground md:text-xl">
            Nigeria's premier technology innovation hub, fostering creativity, collaboration, and growth in the tech
            ecosystem since 2019.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="pt-4 pb-8">
        <div className="grid gap-8 md:grid-cols-2">
          <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <CardHeader>
              <CardTitle className="text-2xl text-primary">Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                To provide world-class infrastructure, resources, and community support that empowers tech
                entrepreneurs, startups, and innovators to build solutions that transform Nigeria and Africa.
              </p>
            </CardContent>
          </Card>

          <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <CardHeader>
              <CardTitle className="text-2xl text-secondary">Our Vision</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                To be the leading technology innovation hub in West Africa, recognized for nurturing breakthrough
                innovations and creating a thriving ecosystem for tech talent and businesses.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 rounded-lg">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold">Our Impact</h2>
          <p className="text-muted-foreground mt-2">Numbers that tell our story</p>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={index} className="border border-gray-300 rounded-lg text-center p-6 transition-all duration-300 hover:scale-105">
              <stat.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="py-12">
        <div className="mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Our Story</h2>
          <div className="prose prose-lg max-w-none text-muted-foreground">
            <p className="mb-6">
              Founded in 2019 at the University of Lagos, Nithub began as a small initiative to provide students and
              young entrepreneurs with access to technology resources and mentorship. What started as a single room with
              a few computers has grown into Nigeria's most vibrant tech innovation hub.
            </p>
            <p className="mb-6">
              Today, we operate multiple locations across Lagos, providing state-of-the-art coworking spaces, event
              venues, and incubation programs. Our community includes over 500 active members, from solo entrepreneurs
              to growing startups and established tech companies.
            </p>
            <p>
              We've hosted over 1,200 events, including hackathons, workshops, conferences, and networking sessions. Our
              alumni have gone on to raise millions in funding, create thousands of jobs, and build solutions that are
              making a real impact across Africa.
            </p>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Meet Our Team</h2>
          <p className="text-muted-foreground mt-2">The people behind Nithub's success</p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {team.map((member, index) => (
            <Card key={index} className="text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <CardHeader>
                <div className="mx-auto mb-4">
                  <img
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    className="w-24 h-24 rounded-full object-cover mx-auto"
                    width={96}
                    height={96}
                  />
                </div>
                <CardTitle>{member.name}</CardTitle>
                <Badge variant="secondary" className="w-fit mx-auto bg-green-300">
                  {member.role}
                </Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{member.bio}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Our Values</h2>
          <p className="text-muted-foreground mt-2">What drives us every day</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Innovation",
              description: "We foster creativity and encourage bold thinking to solve complex problems.",
            },
            {
              title: "Community",
              description: "We believe in the power of collaboration and building strong relationships.",
            },
            {
              title: "Excellence",
              description: "We strive for the highest standards in everything we do.",
            },
            {
              title: "Impact",
              description: "We measure success by the positive change we create in society.",
            },
          ].map((value, index) => (
            <Card key={index} className="text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="text-lg">{value.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
