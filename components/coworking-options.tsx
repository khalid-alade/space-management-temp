import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"
import { coworkingPlans } from "@/data/coworking-plans"

export function CoworkingOptions() {
  return (
    // <section className="py-12 md:py-16 lg:py-20" id="coworking">
    <section className="pb-12 md:pb-16 lg:pb-20" id="coworking">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            {/* <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Coworking Space Options</h2> */}
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Choose the perfect plan for your work style, whether you need a space for a day or a month.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 pt-12 md:grid-cols-2 lg:grid-cols-3">
          {coworkingPlans.map((plan) => (
            <Card key={plan.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="mb-4">
                  <span className="text-3xl font-bold">₦{plan.price.toLocaleString()}</span>
                  <span className="text-muted-foreground">/{plan.interval}</span>
                </div>
                <ul className="space-y-2 text-sm">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-secondary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                {/* <Link href={`/coworking/book?plan=${plan.id}`} className="w-full"> */}
                <Link href="/login" className="w-full">
                  <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                    {plan.popular ? "Recommended" : "Book Now"}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
