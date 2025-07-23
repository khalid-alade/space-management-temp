// "use client"
import type { Metadata } from "next"
import { RedirectIfAuth } from "@/components/redirect-if-auth"
import { EventSpaces } from "@/components/event-spaces"
import { CallToAction } from "@/components/call-to-action"

export const metadata: Metadata = {
  title: "Event Spaces",
  description: "Book event spaces and venues at Nithub",
}

export default function EventSpacesPage() {
  return (
    <RedirectIfAuth>
      <div className="container mx-auto px-4 bg-muted/50">
        {/* <section className="py-12 md:py-16 lg:py-20"> */}
        <section className="pt-12 md:pt-16 lg:pt-20">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Event Spaces at Nithub for Every Occasion</h1>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Host your next event, workshop, or meeting in our versatile spaces.
                </p>
              </div>
            </div>
          </div>
        </section>
        <EventSpaces />
        <CallToAction />
      </div>
    </RedirectIfAuth>
  )
}
