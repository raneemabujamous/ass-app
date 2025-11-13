"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function CreateCustomerPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)

    try {
      const response = await fetch("http://localhost:8081/customer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
        },
        body: JSON.stringify({
          name: formData.get("name") as string,
          email: formData.get("email") as string,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()

        if (response.status === 400) {
          if (errorData.message === "not correct email") {
            toast({
              title: "Invalid Email",
              description: "Please enter a valid email address.",
              variant: "destructive",
            })
          } else if (errorData.message?.includes("email") && errorData.message?.includes("used")) {
            toast({
              title: "Email Already Used",
              description: "This email is already registered in the system. Please use a different email.",
              variant: "destructive",
            })
          } else {
            toast({
              title: "Error",
              description: errorData.message || "Failed to create customer. Please try again.",
              variant: "destructive",
            })
          }
        } else {
          toast({
            title: "Error",
            description: errorData.message || "Failed to create customer. Please try again.",
            variant: "destructive",
          })
        }
        setIsSubmitting(false)
        return
      }

      const createdCustomer = await response.json()

      toast({
        title: "Customer Created",
        description: `Customer has been successfully added to the system.`,
      })

      router.push("/orders/create")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create customer. Please check your connection and try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <div className="mb-6">
        <Link href="/orders/create">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Create Order
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create New Customer</CardTitle>
          <CardDescription>Add a new customer to the system</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" placeholder="John Doe" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" name="email" type="email" placeholder="john@example.com" required />
            </div>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => router.push("/orders/create")}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Customer
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
