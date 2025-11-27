"use client";

import { useState } from "react";
import Button from "@/components/Button";
import { sendContactEmail } from "./actions";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const result = await sendContactEmail(formData);

    if (result.success) {
      setMessage({ 
        type: 'success', 
        text: 'Merci ! Votre message a été envoyé avec succès.' 
      });
      form.reset();
    } else {
      setMessage({ 
        type: 'error', 
        text: result.error || 'Erreur lors de l\'envoi. Veuillez réessayer.' 
      });
    }

    setIsSubmitting(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-12 text-center">
  <h1 className="text-4xl font-title font-semibold text-primary mb-4 tracking-wide">
          Contactez-nous
        </h1>
        <p className="text-text-secondary text-lg leading-relaxed">
          Une question ? N'hésitez pas à nous écrire
        </p>
      </div>

      {message && (
        <div className={`px-4 py-3 mb-6 border ${
          message.type === 'success' 
            ? 'bg-green-50 border-green-300 text-green-800' 
            : 'bg-red-50 border-red-300 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-accent/20 p-10 space-y-6">
        <div>
          <label htmlFor="name" className="block text-primary font-medium mb-2 text-sm uppercase tracking-wide">
            Nom complet
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="w-full px-4 py-3 border border-accent/30 focus:border-accent outline-none transition"
            placeholder="Votre nom"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-primary font-medium mb-2 text-sm uppercase tracking-wide">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full px-4 py-3 border border-accent/30 focus:border-accent outline-none transition"
            placeholder="votre@email.com"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-primary font-medium mb-2 text-sm uppercase tracking-wide">
            Téléphone (optionnel)
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            className="w-full px-4 py-3 border border-accent/30 focus:border-accent outline-none transition"
            placeholder="+33 6 12 34 56 78"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-primary font-medium mb-2 text-sm uppercase tracking-wide">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={6}
            className="w-full px-4 py-3 border border-accent/30 focus:border-accent outline-none transition resize-none"
            placeholder="Votre message..."
          />
        </div>

        <Button type="submit" fullWidth disabled={isSubmitting}>
          {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
        </Button>
      </form>
    </div>
  );
}
