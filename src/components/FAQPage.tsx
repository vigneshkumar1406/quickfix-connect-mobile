
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import { useState } from "react";
import BackButton from "./BackButton";

export default function FAQPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [openFAQ, setOpenFAQ] = useState(null);

  const faqs = [
    {
      question: "How do I book a service?",
      answer: "Simply select your service, choose your location, pick a time slot, and confirm your booking. A verified worker will be assigned to you within minutes."
    },
    {
      question: "What are Fixsify Coins?",
      answer: "Fixsify Coins are reward points you earn for using our platform. 10 coins = ₹1 and can be used to pay service charges. You earn coins through referrals, online payments, and milestone achievements."
    },
    {
      question: "How do I become a worker?",
      answer: "Register as a worker, complete KYC verification with Aadhaar, pay the ₹99 service charge, and start accepting jobs in your area."
    },
    {
      question: "Is my payment secure?",
      answer: "Yes, we use industry-standard encryption and secure payment gateways like Paytm to ensure your payment information is always protected."
    },
    {
      question: "How do I track my service?",
      answer: "Once a worker accepts your job, you can track their real-time location and get updates on service progress through the app."
    },
    {
      question: "What if I'm not satisfied with the service?",
      answer: "We have a rating and review system. If you're not satisfied, you can rate the service and report issues. We'll work to resolve any problems quickly."
    },
    {
      question: "How do referrals work?",
      answer: "Share your referral code with friends. When they complete their first service, you earn 400 Fixsify Coins as a reward."
    },
    {
      question: "Can I cancel a booking?",
      answer: "Yes, you can cancel a booking before the worker arrives. Cancellation policies may apply depending on timing."
    },
    {
      question: "What languages are supported?",
      answer: "Fixsify supports 6 languages: English, Tamil, Hindi, Telugu, Malayalam, and Kannada."
    },
    {
      question: "How do I contact support?",
      answer: "You can reach our support team through the contact form in the app or call our helpline number available 24/7."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="w-full pb-6 animate-fade-in">
      <div className="mb-6">
        <BackButton withLabel />
      </div>

      <div className="bg-primary text-white p-6 rounded-b-3xl mb-6">
        <div className="flex items-center mb-2">
          <HelpCircle className="w-6 h-6 mr-2" />
          <h1 className="text-2xl font-bold">Frequently Asked Questions</h1>
        </div>
        <p className="opacity-90">Find answers to common questions about Fixsify</p>
      </div>

      <div className="space-y-4 mb-6">
        {faqs.map((faq, index) => (
          <Card key={index} className="overflow-hidden">
            <div
              className="p-4 cursor-pointer hover:bg-neutral-50 transition-colors"
              onClick={() => toggleFAQ(index)}
            >
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-left">{faq.question}</h3>
                {openFAQ === index ? (
                  <ChevronUp className="w-5 h-5 text-neutral-500 flex-shrink-0 ml-2" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-neutral-500 flex-shrink-0 ml-2" />
                )}
              </div>
              
              {openFAQ === index && (
                <div className="mt-3 pt-3 border-t border-neutral-200">
                  <p className="text-neutral-600 text-sm leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-4 mb-6 bg-blue-50 border-blue-200">
        <h3 className="font-semibold mb-2">Still have questions?</h3>
        <p className="text-sm text-neutral-600 mb-3">
          Can't find what you're looking for? Our support team is here to help.
        </p>
        <Button className="w-full">
          Contact Support
        </Button>
      </Card>
    </div>
  );
}
