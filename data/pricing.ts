import { Pricing as PricingType } from "@/types/blocks/pricing";

export const pricingData: PricingType = {
  name: "pricing",
  title: "Simple, Transparent Pricing",
  description: "Choose the perfect plan to transform your outdoor space with AI",
  groups: [
    {
      name: "monthly",
      title: "Monthly",
      description: "Pay as you go"
    },
    {
      name: "yearly", 
      title: "Yearly",
      description: "Save 20%",
      label: "Save 20%"
    }
  ],
  items: [
    {
      title: "Starter",
      description: "Perfect for homeowners with small gardens",
      price: "$9.9",
      unit: "/month",
      group: "monthly",
      interval: "month",
      product_id: "starter_monthly",
      product_name: "Starter Monthly",
      amount: 990,
      currency: "usd",
      credits: 80,
      valid_months: 1,
      features_title: "Everything you need to start:",
      features: [
        "80 AI garden designs per month",
        "Basic plant recommendations",
        "Before & After previews",
        "Download in standard quality",
        "Email support"
      ],
      button: {
        title: "Get Started",
        href: "#"
      }
    },
    {
      title: "Professional", 
      description: "Ideal for garden enthusiasts and landscapers",
      price: "$19.9",
      unit: "/month",
      group: "monthly",
      interval: "month",
      product_id: "pro_monthly",
      product_name: "Professional Monthly",
      amount: 1990,
      currency: "usd",
      credits: 200,
      valid_months: 1,
      is_featured: true,
      label: "Most Popular",
      features_title: "Everything in Starter, plus:",
      features: [
        "200 AI garden designs per month",
        "Advanced plant database",
        "Multiple style variations", 
        "HD quality downloads",
        "3D visualization preview",
        "Priority email support",
        "Custom color schemes"
      ],
      button: {
        title: "Get Started",
        href: "#"
      }
    },
    {
      title: "Business",
      description: "For landscaping businesses and designers",
      price: "$29.9",
      unit: "/month", 
      group: "monthly",
      interval: "month",
      product_id: "business_monthly",
      product_name: "Business Monthly",
      amount: 2990,
      currency: "usd",
      credits: 500,
      valid_months: 1,
      features_title: "Everything in Professional, plus:",
      features: [
        "500 AI garden designs per month",
        "Commercial usage rights",
        "White-label exports",
        "API access",
        "Team collaboration (5 seats)",
        "Custom AI training",
        "24/7 phone support",
        "Dedicated account manager"
      ],
      button: {
        title: "Get Started",
        href: "#"
      }
    },
    // Yearly plans
    {
      title: "Starter",
      description: "Perfect for homeowners with small gardens",
      price: "$7.9",
      original_price: "$9.9",
      unit: "/month",
      group: "yearly",
      interval: "year",
      product_id: "starter_yearly",
      product_name: "Starter Yearly",
      amount: 9480,
      currency: "usd",
      credits: 960,
      valid_months: 12,
      features_title: "Everything you need to start:",
      features: [
        "80 AI garden designs per month",
        "Basic plant recommendations",
        "Before & After previews",
        "Download in standard quality",
        "Email support"
      ],
      button: {
        title: "Get Started",
        href: "#"
      },
      tip: "Billed annually at $94.8"
    },
    {
      title: "Professional",
      description: "Ideal for garden enthusiasts and landscapers", 
      price: "$15.9",
      original_price: "$19.9",
      unit: "/month",
      group: "yearly",
      interval: "year",
      product_id: "pro_yearly",
      product_name: "Professional Yearly",
      amount: 19080,
      currency: "usd",
      credits: 2400,
      valid_months: 12,
      is_featured: true,
      label: "Best Value",
      features_title: "Everything in Starter, plus:",
      features: [
        "200 AI garden designs per month",
        "Advanced plant database",
        "Multiple style variations",
        "HD quality downloads", 
        "3D visualization preview",
        "Priority email support",
        "Custom color schemes"
      ],
      button: {
        title: "Get Started",
        href: "#"
      },
      tip: "Billed annually at $190.8"
    },
    {
      title: "Business",
      description: "For landscaping businesses and designers",
      price: "$23.9",
      original_price: "$29.9",
      unit: "/month",
      group: "yearly", 
      interval: "year",
      product_id: "business_yearly",
      product_name: "Business Yearly",
      amount: 28680,
      currency: "usd",
      credits: 6000,
      valid_months: 12,
      features_title: "Everything in Professional, plus:",
      features: [
        "500 AI garden designs per month",
        "Commercial usage rights",
        "White-label exports",
        "API access",
        "Team collaboration (5 seats)",
        "Custom AI training",
        "24/7 phone support",
        "Dedicated account manager"
      ],
      button: {
        title: "Get Started",
        href: "#"
      },
      tip: "Billed annually at $286.8"
    }
  ]
};