import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="py-12 lg:py-20">
    {/* <section className="py-12 md:py-24 lg:py-32 xl:py-48"> */}
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Your Perfect Workspace at Nithub
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Book coworking spaces for daily or monthly use, or reserve event venues for your next gathering. All in
                one place.
              </p>
            </div>
            {/* <div className="flex flex-col gap-2 min-[400px]:flex-row"> */}
            <div className="flex flex-col gap-2">
              <Link href="/coworking">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Book Coworking Space
                </Button>
              </Link>
              <Link href="/event-spaces">
                <Button size="lg" variant="outline">
                  Explore Event Venues
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative h-[350px] w-full overflow-hidden rounded-xl bg-muted md:h-[450px]">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
              <img
                src="/placeholder.svg?height=450&width=600"
                alt="Nithub coworking space"
                className="object-cover w-full h-full"
                width={600}
                height={450}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
