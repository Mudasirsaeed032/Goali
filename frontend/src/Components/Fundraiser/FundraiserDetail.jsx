"use client";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import { ArrowLeft, Clock, Users, AlertCircle, Loader2 } from "lucide-react";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

function FundraiserDetail() {
  const { id } = useParams();
  const [fundraiser, setFundraiser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:5000/fundraisers/with-progress")
      .then((res) => {
        const found = res.data.find((f) => f.id === id);
        if (found) {
          const enhancedData = {
            ...found,
            category: found.category || "medical",
            supporters: found.supporters || Math.floor(Math.random() * 100) + 5,
            days_left: found.days_left || Math.floor(Math.random() * 30) + 1,
          };
          setFundraiser(enhancedData);
        } else {
          setError("Fundraiser not found");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching fundraiser", err);
        setError("Failed to load fundraiser details. Please try again later.");
        setLoading(false);
      });
  }, [id]);

  const onSubmit = async ({ amount }) => {
    try {
      setIsSubmitting(true);

      // Ensure the amount is in USD and not less than $0.50
      if (amount < 0.50) {
        alert('The minimum donation is $0.50 USD');
        setIsSubmitting(false);
        return;
      }

      const res = await axios.post(`http://localhost:5000/fundraisers/${id}/pay`, { amount }, { withCredentials: true });
      window.location.href = res.data.url; // Redirect to Stripe Checkout
    } catch (err) {
      alert("Stripe error: " + (err.response?.data?.error || err.message));
      setIsSubmitting(false);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Render loading skeleton
  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <Skeleton className="h-8 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-6" />
        <Skeleton className="h-[300px] w-full rounded-lg mb-6" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="mt-4 text-center">
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  if (!fundraiser) return null;

  const percent = Math.min((fundraiser.collected_amount / fundraiser.goal_amount) * 100, 100);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card className="overflow-hidden border-none shadow-lg">
        {/* Header with image */}
        <div className="relative h-64 overflow-hidden">
          <img
            src={fundraiser.image_url || "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=1000&auto=format&fit=crop"}
            className="w-full h-full object-cover"
            alt="Fundraiser"
          />
          <div className="absolute top-4 left-4">
            <Badge className="capitalize bg-white/80 text-primary hover:bg-white/70">
              {fundraiser.category || "Fundraiser"}
            </Badge>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        </div>

        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-bold">{fundraiser.title}</CardTitle>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{fundraiser.supporters || 0} supporters</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{fundraiser.days_left || 0} days left</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Description */}
          <p className="text-base leading-relaxed">{fundraiser.description}</p>

          {/* Progress */}
          <div className="space-y-2 bg-muted/30 p-4 rounded-lg">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{formatCurrency(fundraiser.collected_amount)}</span>
              <span className="text-muted-foreground">of {formatCurrency(fundraiser.goal_amount)}</span>
            </div>
            <Progress value={percent} className="h-2" />
            <div className="text-xs text-muted-foreground pt-1 text-right">{percent.toFixed(0)}% complete</div>
          </div>

          <Separator />

          {/* Donation Form */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Make a Donation</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Donation Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount in USD."
                  className={errors.amount ? "border-red-500" : ""}
                  {...register("amount", {
                    required: "Amount is required",
                    valueAsNumber: true,
                    min: {
                      value: 0.5,
                      message: "Amount must be at least $0.50 USD",
                    },
                  })}
                />
                {errors.amount && <p className="text-red-500 text-sm">{errors.amount.message}</p>}
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500 hover:opacity-90"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Donate via Stripe"
                  )}
                </Button>
                <p className="text-xs text-center text-muted-foreground">Your donation is secure and encrypted</p>
              </div>
            </form>
          </div>
        </CardContent>

        <CardFooter className="bg-muted/20 flex justify-between">
          <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <p className="text-xs text-muted-foreground">Thank you for your support</p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default FundraiserDetail;
