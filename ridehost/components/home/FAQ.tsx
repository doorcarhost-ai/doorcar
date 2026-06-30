"use client";

import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FAQS } from "@/lib/constants";

export function FAQ() {
  return (
    <section className="py-20 bg-[#F8F9FB]">
      <div className="px-4 sm:px-6 max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-sm font-bold text-[#FF7A00] uppercase tracking-widest mb-3"
          >
            Got Questions?
          </motion.p>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="text-2xl sm:text-4xl font-bold text-[#111827]"
          >
            Frequently Asked Questions
          </motion.h2>
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl border border-[#E5E7EB] shadow-premium overflow-hidden"
        >
          <Accordion type="single" collapsible className="w-full">
            {FAQS.map((faq, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`} className="px-5 last:border-b-0">
                <AccordionTrigger className="text-left font-semibold text-sm text-[#111827] hover:text-[#FF7A00] hover:no-underline py-5 transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-[#6B7280] leading-relaxed pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
