export async function sendContactNotification(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  // URL du workflow Pipedream OAuth
  const pipedreamUrl = process.env.PIPEDREAM_WEBHOOK_URL;
  
  if (!pipedreamUrl) {
    console.log("Contact form submitted but notification skipped - Webhook URL missing");
    return;
  }
  
  // Format standard Discord pour les OAuth webhooks
  const payload = {
    // Message texte simple (hors embeds)
    content: "📬 Nouveau message du formulaire de contact!",
    
    // Embeds au format standard Discord (pas embedsData)
    embeds: [
      {
        title: `Sujet: ${data.subject}`,
        color: 0x5865F2, // Bleu Discord
        fields: [
          { name: "Nom", value: data.name, inline: true },
          { name: "Email", value: data.email, inline: true },
          { name: "Message", value: data.message }
        ],
        footer: { text: "Envoyé depuis le formulaire de contact du portfolio" },
        timestamp: new Date().toISOString()
      }
    ]
  };
  
  try {
    const response = await fetch(pipedreamUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Response ${response.status}: ${response.statusText}`);
    }
    
    console.log("Contact form data sent to Pipedream successfully");
  } catch (error) {
    console.error('Failed to send notification:', error);
  }
}
