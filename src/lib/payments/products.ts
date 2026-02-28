export const products = [
  {
    productId: "418f16b1-b326-49de-9fe6-7ac0b9e3865b",
    id: "free",
    name: "Free Plan",
    description: "Access to basic features",
    price: "Free",
    benefits: ["100 students maximum", "10 grades and sections"],
  },
  {
    productId: "331cb35c-2c45-48cb-a5d4-2332c405d307",
    id: "basic",
    name: "Professional Plan",
    description: "For growing classrooms",
    price: "$24.99/month",
    benefits: [
      "500 students maximum",
      "+20 grades and sections",
      "Online classroom access",
      "Priority support",
    ],
  },
  {
    productId: "e17755b0-0e97-41d9-a7fc-ad3ed0dd36ae",
    id: "complete",
    name: "Enterprise Plan",
    description: "For large institutions and enterprises",
    price: "$59.99/month",
    benefits: [
      "1000 students maximum",
      "+100 grades and sections",
      "Online classroom access",
      "Priority support",
      "Access to Lara Agent AI assistant",
    ],
  },
] as const;

