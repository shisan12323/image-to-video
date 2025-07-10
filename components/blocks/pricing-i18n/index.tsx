"use client";

import { Check, Loader } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Icon from "@/components/icon";
import { Label } from "@/components/ui/label";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "sonner";
import { useAppContext } from "@/contexts/app";
import { useTranslations } from "next-intl";

// Product data that doesn't change with language
const productData = {
  monthly: [
    {
      product_id: "starter_monthly",
      product_name: "Starter Monthly",
      amount: 990,
      currency: "usd",
      credits: 80,
      valid_months: 1,
      interval: "month"
    },
    {
      product_id: "pro_monthly",
      product_name: "Professional Monthly",
      amount: 1990,
      currency: "usd",
      credits: 200,
      valid_months: 1,
      interval: "month",
      is_featured: true
    },
    {
      product_id: "business_monthly",
      product_name: "Business Monthly",
      amount: 2990,
      currency: "usd",
      credits: 500,
      valid_months: 1,
      interval: "month"
    }
  ],
  yearly: [
    {
      product_id: "starter_yearly",
      product_name: "Starter Yearly",
      amount: 9480,
      currency: "usd",
      credits: 960,
      valid_months: 12,
      interval: "year"
    },
    {
      product_id: "pro_yearly",
      product_name: "Professional Yearly",
      amount: 19080,
      currency: "usd",
      credits: 2400,
      valid_months: 12,
      interval: "year",
      is_featured: true
    },
    {
      product_id: "business_yearly",
      product_name: "Business Yearly",
      amount: 28680,
      currency: "usd",
      credits: 6000,
      valid_months: 12,
      interval: "year"
    }
  ]
};

export default function PricingI18n() {
  const { user, setShowSignModal } = useAppContext();
  const t = useTranslations('pricing');
  
  const [group, setGroup] = useState("monthly");
  const [isLoading, setIsLoading] = useState(false);
  const [productId, setProductId] = useState<string | null>(null);

  const groups = t.raw('groups') || [];
  const plans = t.raw('plans') || [];

  const handleCheckout = async (planIndex: number, cn_pay: boolean = false) => {
    try {
      if (!user) {
        setShowSignModal(true);
        return;
      }

      const currentPlans = group === "monthly" ? productData.monthly : productData.yearly;
      const productInfo = currentPlans[planIndex];
      
      if (!productInfo) return;

      const params = {
        product_id: productInfo.product_id,
        product_name: productInfo.product_name,
        credits: productInfo.credits,
        interval: productInfo.interval,
        amount: productInfo.amount,
        currency: productInfo.currency,
        valid_months: productInfo.valid_months,
      };

      setIsLoading(true);
      setProductId(productInfo.product_id);

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      if (response.status === 401) {
        setIsLoading(false);
        setProductId(null);
        setShowSignModal(true);
        return;
      }

      const { code, message, data } = await response.json();
      if (code !== 0) {
        toast.error(message);
        return;
      }

      const { public_key, session_id } = data;

      const stripe = await loadStripe(public_key);
      if (!stripe) {
        toast.error("checkout failed");
        return;
      }

      const result = await stripe.redirectToCheckout({
        sessionId: session_id,
      });

      if (result.error) {
        toast.error(result.error.message);
      }
    } catch (e) {
      console.log("checkout failed: ", e);
      toast.error("checkout failed");
    } finally {
      setIsLoading(false);
      setProductId(null);
    }
  };

  const currentPlans = plans.filter((plan: any) => plan.group === group);

  return (
    <section id="pricing" className="py-16">
      <div className="container">
        <div className="mx-auto mb-16 text-center">
          <h2 className="mb-6 text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            {t('title')}
          </h2>
          <p className="text-slate-600 text-xl lg:text-2xl max-w-3xl mx-auto leading-relaxed">
            {t('description')}
          </p>
        </div>
        <div className="flex flex-col items-center gap-2">
          {groups && groups.length > 0 && (
            <div className="flex h-14 mb-16 items-center rounded-2xl bg-slate-100 p-2 shadow-inner">
              <RadioGroup
                value={group}
                className={`h-full grid grid-cols-${groups.length} w-full gap-2`}
                onValueChange={(value) => {
                  setGroup(value);
                }}
              >
                {groups.map((item: any, i: number) => {
                  return (
                    <div
                      key={i}
                      className='h-full rounded-xl transition-all duration-300 has-[button[data-state="checked"]]:bg-white has-[button[data-state="checked"]]:shadow-lg'
                    >
                      <RadioGroupItem
                        value={item.name || ""}
                        id={item.name}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={item.name}
                        className="flex h-full cursor-pointer items-center justify-center px-8 font-bold text-slate-600 peer-data-[state=checked]:text-emerald-600 transition-all duration-300 hover:text-emerald-500"
                      >
                        {item.title}
                        {item.label && (
                          <Badge
                            variant="outline"
                            className="border-emerald-500 bg-gradient-to-r from-emerald-500 to-teal-500 px-2 ml-2 text-white text-xs font-semibold"
                          >
                            {item.label}
                          </Badge>
                        )}
                      </Label>
                    </div>
                  );
                })}
              </RadioGroup>
            </div>
          )}
          <div
            className={`md:min-w-96 mt-0 grid gap-6 md:grid-cols-${currentPlans.length}`}
          >
            {currentPlans.map((plan: any, index: number) => {
              const productInfo = group === "monthly" ? productData.monthly[index] : productData.yearly[index];
              
              return (
                <div
                  key={index}
                  className={`rounded-xl p-8 transition-all duration-300 ${
                    productInfo?.is_featured
                      ? "border-emerald-500 border-2 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 shadow-xl scale-105"
                      : "border-slate-200 border hover:border-emerald-300 hover:shadow-lg"
                  }`}
                >
                  <div className="flex h-full flex-col justify-between gap-5">
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        {plan.title && (
                          <h3 className="text-xl font-semibold">
                            {plan.title}
                          </h3>
                        )}
                        <div className="flex-1"></div>
                        {plan.label && (
                          <Badge
                            variant="outline"
                            className="border-emerald-500 bg-gradient-to-r from-emerald-500 to-teal-500 px-3 py-1 text-white font-semibold"
                          >
                            {plan.label}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-end gap-2 mb-4">
                        {plan.original_price && (
                          <span className="text-xl text-muted-foreground font-semibold line-through">
                            {plan.original_price}
                          </span>
                        )}
                        {plan.price && (
                          <span className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                            {plan.price}
                          </span>
                        )}
                        {plan.unit && (
                          <span className="block font-semibold">
                            {plan.unit}
                          </span>
                        )}
                      </div>
                      {plan.description && (
                        <p className="text-muted-foreground">
                          {plan.description}
                        </p>
                      )}
                      {plan.features_title && (
                        <p className="mb-3 mt-6 font-semibold">
                          {plan.features_title}
                        </p>
                      )}
                      {plan.features && (
                        <ul className="flex flex-col gap-3">
                          {plan.features.map((feature: string, fi: number) => {
                            return (
                              <li className="flex gap-3" key={`feature-${fi}`}>
                                <Check className="mt-0.5 size-5 shrink-0 text-emerald-500" />
                                <span className="text-slate-700">{feature}</span>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button
                        className={`w-full flex items-center justify-center gap-2 font-semibold py-6 text-lg transition-all duration-300 ${
                          productInfo?.is_featured 
                            ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl"
                            : "bg-slate-900 hover:bg-slate-800 text-white"
                        }`}
                        disabled={isLoading}
                        onClick={() => {
                          if (isLoading) {
                            return;
                          }
                          handleCheckout(index);
                        }}
                      >
                        {(!isLoading ||
                          (isLoading && productId !== productInfo?.product_id)) && (
                          <p>{plan.button_title}</p>
                        )}

                        {isLoading && productId === productInfo?.product_id && (
                          <p>{plan.button_title}</p>
                        )}
                        {isLoading && productId === productInfo?.product_id && (
                          <Loader className="mr-2 h-4 w-4 animate-spin" />
                        )}
                      </Button>
                      {plan.tip && (
                        <p className="text-muted-foreground text-sm mt-2">
                          {plan.tip}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}