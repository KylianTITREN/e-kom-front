import ContactPage from "@/components/ContactPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: process.env.SEO_CONTACT_TITLE,
  description: process.env.SEO_CONTACT_DESCRIPTION,
  keywords: process.env.SEO_CONTACT_KEYWORDS
};

export default function ContactPageWrapper() {
  return <ContactPage/>;
}