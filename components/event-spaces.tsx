import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users } from "lucide-react"
import { eventSpaces } from "@/data/event-spaces"

export function EventSpaces() {
  return (
    <section className="pb-12 md:pb-16 lg:pb-20" id="event-spaces">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            {/* <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Event Spaces for Every Occasion
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Host your next workshop, meetup, or conference in our versatile event spaces.
            </p> */}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 pt-12 md:grid-cols-2 lg:grid-cols-3">
          {eventSpaces.map((space) => (
            <Card key={space.id} className="overflow-hidden">
              <div className="aspect-video relative">
                <img
                  src={space.image || "/placeholder.svg?height=200&width=400"}
                  alt={space.name}
                  className="object-cover w-full h-full"
                  width={400}
                  height={200}
                />
                {space.featured && (
                  <Badge className="absolute top-2 right-2 bg-secondary hover:bg-secondary/80">Featured</Badge>
                )}
              </div>
              <CardHeader>
                <CardTitle>{space.name}</CardTitle>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="mr-1 h-4 w-4" />
                  <span>Capacity: {space.capacity} people</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{space.description}</p>
                <div className="mt-4">
                  <span className="text-xl font-bold">₦{space.pricePerHour.toLocaleString()}</span>
                  <span className="text-muted-foreground">/hour</span>
                </div>
              </CardContent>
              <CardFooter>
                {/* <Link href={`/event-spaces/book?space=${space.id}`} className="w-full"> */}
                <Link href="/login" className="w-full">
                  <Button className="w-full">Book This Space</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link href="/event-spaces">
            <Button variant="outline" size="lg">
              View All Event Spaces
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
