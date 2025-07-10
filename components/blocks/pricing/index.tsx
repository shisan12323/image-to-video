"use client";

import { Check, Loader } from "lucide-react";
import { PricingItem, Pricing as PricingType } from "@/types/blocks/pricing";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Icon from "@/components/icon";
import { Label } from "@/components/ui/label";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "sonner";
import { useAppContext } from "@/contexts/app";

export default function Pricing({ pricing }: { pricing: PricingType }) {
  if (pricing.disabled) {
    return null;
  }

  const { user, setShowSignModal } = useAppContext();

  const [group, setGroup] = useState(pricing.groups?.[0]?.name);
  const [isLoading, setIsLoading] = useState(false);
  const [productId, setProductId] = useState<string | null>(null);

  const handleCheckout = async (item: PricingItem, cn_pay: boolean = false) => {
    try {
      if (!user) {
        setShowSignModal(true);
        return;
      }

      const params = {
        product_id: item.product_id,
        product_name: item.product_name,
        credits: item.credits,
        interval: item.interval,
        amount: cn_pay ? item.cn_amount : item.amount,
        currency: cn_pay ? "cny" : item.currency,
        valid_months: item.valid_months,
      };

      setIsLoading(true);
      setProductId(item.product_id);

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

  useEffect(() => {
    if (pricing.items) {
      setGroup(pricing.items[0].group);
      setProductId(pricing.items[0].product_id);
      setIsLoading(false);
    }
  }, [pricing.items]);

  return (
    <section id={pricing.name} className="py-16">
      <div className="container">
        <div className="mx-auto mb-16 text-center">
          <h2 className="mb-6 text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            {pricing.title}
          </h2>
          <p className="text-slate-600 text-xl lg:text-2xl max-w-3xl mx-auto leading-relaxed">
            {pricing.description}
          </p>
        </div>
        <div className="flex flex-col items-center gap-2">
          {pricing.groups && pricing.groups.length > 0 && (
            <div className="flex h-14 mb-16 items-center rounded-2xl bg-slate-100 p-2 shadow-inner">
              <RadioGroup
                value={group}
                className={`h-full grid grid-cols-${pricing.groups.length} w-full gap-2`}
                onValueChange={(value) => {
                  setGroup(value);
                }}
              >
                {pricing.groups.map((item, i) => {
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
            className={`md:min-w-96 mt-0 grid gap-6 md:grid-cols-${
              pricing.items?.filter(
                (item) => !item.group || item.group === group
              )?.length
            }`}
          >
            {pricing.items?.map((item, index) => {
              if (item.group && item.group !== group) {
                return null;
              }

              return (
                <div
                  key={index}
                  className={`rounded-xl p-8 transition-all duration-300 ${
                    item.is_featured
                      ? "border-emerald-500 border-2 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 shadow-xl scale-105"
                      : "border-slate-200 border hover:border-emerald-300 hover:shadow-lg"
                  }`}
                >
                  <div className="flex h-full flex-col justify-between gap-5">
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        {item.title && (
                          <h3 className="text-xl font-semibold">
                            {item.title}
                          </h3>
                        )}
                        <div className="flex-1"></div>
                        {item.label && (
                          <Badge
                            variant="outline"
                            className="border-emerald-500 bg-gradient-to-r from-emerald-500 to-teal-500 px-3 py-1 text-white font-semibold"
                          >
                            {item.label}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-end gap-2 mb-4">
                        {item.original_price && (
                          <span className="text-xl text-muted-foreground font-semibold line-through">
                            {item.original_price}
                          </span>
                        )}
                        {item.price && (
                          <span className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                            {item.price}
                          </span>
                        )}
                        {item.unit && (
                          <span className="block font-semibold">
                            {item.unit}
                          </span>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-muted-foreground">
                          {item.description}
                        </p>
                      )}
                      {item.features_title && (
                        <p className="mb-3 mt-6 font-semibold">
                          {item.features_title}
                        </p>
                      )}
                      {item.features && (
                        <ul className="flex flex-col gap-3">
                          {item.features.map((feature, fi) => {
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
                      {item.cn_amount && item.cn_amount > 0 ? (
                        <div className="flex items-center gap-x-2 mt-2">
                          <span className="text-sm">人民币支付 👉</span>
                          <div
                            className="inline-block p-2 hover:cursor-pointer hover:bg-base-200 rounded-md"
                            onClick={() => {
                              if (isLoading) {
                                return;
                              }
                              handleCheckout(item, true);
                            }}
                          >
                            <img
                              src="/imgs/cnpay.png"
                              alt="Chinese Payment Methods - WeChat Pay and Alipay"
                              className="w-20 h-10 rounded-lg"
                            />
                          </div>
                        </div>
                      ) : null}
                      {item.button && (
                        <Button
                          className={`w-full flex items-center justify-center gap-2 font-semibold py-6 text-lg transition-all duration-300 ${
                            item.is_featured 
                              ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl"
                              : "bg-slate-900 hover:bg-slate-800 text-white"
                          }`}
                          disabled={isLoading}
                          onClick={() => {
                            if (isLoading) {
                              return;
                            }
                            handleCheckout(item);
                          }}
                        >
                          {(!isLoading ||
                            (isLoading && productId !== item.product_id)) && (
                            <p>{item.button.title}</p>
                          )}

                          {isLoading && productId === item.product_id && (
                            <p>{item.button.title}</p>
                          )}
                          {isLoading && productId === item.product_id && (
                            <Loader className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          {item.button.icon && (
                            <Icon name={item.button.icon} className="size-4" />
                          )}
                        </Button>
                      )}
                      {item.tip && (
                        <p className="text-muted-foreground text-sm mt-2">
                          {item.tip}
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
