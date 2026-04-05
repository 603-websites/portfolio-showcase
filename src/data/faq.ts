export interface FAQItem {
  question: string;
  answer: string;
}

export const faqItems: FAQItem[] = [
  {
    question: "How long does it take to build a website?",
    answer:
      "Most websites go live in just a few days. For more complex projects with custom integrations, it can take 1-2 weeks. We'll give you a clear timeline before we start.",
  },
  {
    question: "Do you offer support after launch?",
    answer:
      "Yes, every project includes 1 full year of free support. We handle updates, fixes, and maintenance so you can focus on running your business.",
  },
  {
    question: "How much does a website cost?",
    answer:
      "Every project is different, so we provide custom quotes based on your needs. We offer simple monthly plans starting at $100/month with a one-time setup fee. Book a free consultation to get a quote.",
  },
  {
    question: "What's your process like?",
    answer:
      "We start with a conversation to understand your goals. Then we build a prototype, iterate with your feedback, develop the final site, and provide 1 year of support after launch.",
  },
  {
    question: "Can you add online booking or payments to my site?",
    answer:
      "Absolutely. We build sites with online booking, payment processing, and other integrations. Whether you need appointment scheduling, e-commerce, or custom forms, we've got you covered.",
  },
];
