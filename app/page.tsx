"use client"
import { RedirectIfAuth } from "@/components/redirect-if-auth"
import { HeroSection } from "@/components/hero-section"
import { CoworkingOptions } from "@/components/coworking-options"
import { EventSpaces } from "@/components/event-spaces"
import { Testimonials } from "@/components/testimonials"
import { Features } from "@/components/features"
import { CallToAction } from "@/components/call-to-action"

export default function Home() {
  return (
    <RedirectIfAuth>
      <div className="container mx-auto px-4 py-8 bg-muted/50">
        <HeroSection />
        <Features />
        {/* <CoworkingOptions /> */}
        {/* <EventSpaces /> */}
        <Testimonials />
        <CallToAction />
      </div>
    </RedirectIfAuth>
  )
}