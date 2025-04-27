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
    "sujet": data.subject,
    "name": data.name,
    "email": data.email,
    "message": data.message
  };
  
  try {
    const response = await fetch(pipedreamUrl, {
      method: 'POST',
      headers: { 'User-Agent': 'pipedream/1' ,'Content-Type': 'application/json', "Authorization": `Bearer ${process.env.PIPEDREAM_TOKEN}` },
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