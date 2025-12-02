"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

export async function sendContactEmail(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const message = formData.get("message") as string;

  // Validation
  if (!name || !email || !message) {
    return { 
      success: false, 
      error: "Nom, email et message sont requis" 
    };
  }

  // Validation email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { 
      success: false, 
      error: "Format d'email invalide" 
    };
  }

  try {
    // Formater l'expéditeur avec le nom si disponible
    const fromName = process.env.NEXT_PUBLIC_EMAIL_FROM_NAME || "Site";
    const fromEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL_FROM || "onboarding@resend.dev";
    const fromFormatted = `${fromName} <${fromEmail}>`;

    const { data, error } = await resend.emails.send({
      from: fromFormatted,
      to: process.env.NEXT_PUBLIC_CONTACT_EMAIL_TO || "delivered@resend.dev",
      subject: `Nouveau message de contact - ${name}`,
      replyTo: email,
      html: `
        <!DOCTYPE html>
        <html lang="fr">
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Nouveau message de contact</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5; line-height: 1.6;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
              <tr>
                <td align="center">
                  <!-- Container principal -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);">
                    
                    <!-- Header sobre -->
                    <tr>
                      <td style="background-color: #2c3e50; padding: 35px 30px; text-align: center;">
                        <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600; letter-spacing: -0.5px;">
                          Nouveau Message
                        </h1>
                        <p style="margin: 8px 0 0 0; color: #bdc3c7; font-size: 14px;">
                          Formulaire de contact
                        </p>
                      </td>
                    </tr>
                    
                    <!-- Contenu -->
                    <tr>
                      <td style="padding: 40px 30px;">
                        
                        <!-- Informations du contact -->
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                          <tr>
                            <td style="padding: 25px; background-color: #f8f9fa; border-radius: 6px; border-left: 3px solid #2c3e50;">
                              <h2 style="margin: 0 0 20px 0; color: #2c3e50; font-size: 16px; font-weight: 600;">
                                Informations du contact
                              </h2>
                              
                              <!-- Nom -->
                              <div style="margin-bottom: 16px;">
                                <div style="color: #7f8c8d; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">
                                  Nom complet
                                </div>
                                <div style="color: #2c3e50; font-size: 15px; font-weight: 500;">
                                  ${name}
                                </div>
                              </div>
                              
                              <!-- Email -->
                              <div style="margin-bottom: 16px;">
                                <div style="color: #7f8c8d; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">
                                  Adresse email
                                </div>
                                <div style="color: #2c3e50; font-size: 15px;">
                                  <a href="mailto:${email}" style="color: #34495e; text-decoration: none; font-weight: 500;">
                                    ${email}
                                  </a>
                                </div>
                              </div>
                              
                              ${phone ? `
                              <!-- Téléphone -->
                              <div style="margin-bottom: 0;">
                                <div style="color: #7f8c8d; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">
                                  Téléphone
                                </div>
                                <div style="color: #2c3e50; font-size: 15px;">
                                  <a href="tel:${phone}" style="color: #34495e; text-decoration: none; font-weight: 500;">
                                    ${phone}
                                  </a>
                                </div>
                              </div>
                              ` : ''}
                            </td>
                          </tr>
                        </table>
                        
                        <!-- Message -->
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="padding: 25px; background-color: #ffffff; border-radius: 6px; border: 1px solid #e0e0e0;">
                              <h3 style="margin: 0 0 15px 0; color: #2c3e50; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                                Message
                              </h3>
                              <div style="color: #34495e; font-size: 15px; line-height: 1.7; white-space: pre-wrap; word-wrap: break-word;">
                                ${message.replace(/\n/g, '<br>')}
                              </div>
                            </td>
                          </tr>
                        </table>
                        
                        <!-- Action button -->
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 30px;">
                          <tr>
                            <td align="center">
                              <a href="mailto:${email}" style="display: inline-block; padding: 12px 30px; background-color: #2c3e50; color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: 600; font-size: 14px;">
                                Répondre au message
                              </a>
                            </td>
                          </tr>
                        </table>
                        
                      </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                      <td style="background-color: #f8f9fa; padding: 25px 30px; text-align: center; border-top: 1px solid #e0e0e0;">
                        <p style="margin: 0 0 6px 0; color: #7f8c8d; font-size: 13px;">
                          Reçu le ${new Date().toLocaleDateString('fr-FR', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                        <p style="margin: 0; color: #95a5a6; font-size: 12px;">
                          Ce message a été envoyé depuis votre formulaire de contact
                        </p>
                      </td>
                    </tr>
                    
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error("❌ Erreur Resend:", error);
      return { 
        success: false, 
        error: "Erreur lors de l'envoi de l'email" 
      };
    }

    console.log("✅ Email envoyé avec succès:", data?.id);
    return { success: true };

  } catch (error) {
    console.error("❌ Erreur sendContactEmail:", error);
    return { 
      success: false, 
      error: "Erreur lors de l'envoi de l'email" 
    };
  }
}
