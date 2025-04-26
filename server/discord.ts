
import { Client, IntentsBitField, TextChannel } from 'discord.js';

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.DirectMessages
  ]
});

let isReady = false;

client.once('ready', () => {
  console.log('Discord bot is ready!');
  isReady = true;
});

export async function sendContactNotification(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  if (!isReady || !process.env.DISCORD_USER_ID) return;
  
  try {
    const user = await client.users.fetch(process.env.DISCORD_USER_ID);
    await user.send({
      embeds: [{
        title: '📬 New Contact Form Submission',
        fields: [
          { name: 'Name', value: data.name },
          { name: 'Email', value: data.email },
          { name: 'Subject', value: data.subject },
          { name: 'Message', value: data.message }
        ],
        color: 0x0099ff,
        timestamp: new Date().toISOString()
      }]
    });
  } catch (error) {
    console.error('Failed to send DM:', error);
  }
}

// Connect bot if token is available
if (process.env.DISCORD_BOT_TOKEN) {
  console.log('Tentative de connexion du bot Discord...');
  client.login(process.env.DISCORD_BOT_TOKEN)
    .then(() => {
      console.log('Bot Discord connecté avec succès!');
    })
    .catch((error) => {
      console.error('Erreur de connexion du bot Discord:', error);
    });
} else {
  console.warn('DISCORD_BOT_TOKEN non défini - le bot Discord ne sera pas connecté');
}
