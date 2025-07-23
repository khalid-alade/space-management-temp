// "use client"
import type { Metadata } from "next"
import { RedirectIfAuth } from "@/components/redirect-if-auth"
import { CoworkingOptions } from "@/components/coworking-options"
import { Features } from "@/components/features"
import { CallToAction } from "@/components/call-to-action"

export const metadata: Metadata = {
  title: "Coworking Spaces",
  description: "Book daily or monthly coworking spaces at Nithub",
}

export default function CoworkingPage() {
  return (
    <RedirectIfAuth>
      <div className="container mx-auto px-4 bg-muted/50">
        {/* <section className="py-12 md:py-16 lg:py-20"> */}
        <section className="pt-12 md:pt-16 lg:pt-20">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Coworking Spaces at Nithub
                </h1>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Find your perfect workspace with flexible daily and monthly options.
                </p>
              </div>
            </div>
          </div>
        </section>
        <CoworkingOptions />
        <Features />
        <CallToAction />
      </div>
    </RedirectIfAuth>
  )
}
