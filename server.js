const express = require('express');
const { OpenAI } = require('openai');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// OpenAI setup
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'Lithala LMS Chatbot Backend is running!',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime())
  });
});

// Ping endpoint for uptime monitoring
app.get('/ping', (req, res) => {
  res.json({ 
    status: 'pong', 
    timestamp: new Date().toISOString()
  });
});

// Chat endpoint
app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    console.log('Received message:', message);

    // Check for special Catherine Maloa recognition
    const messageText = message.toLowerCase();
    if (messageText.includes('catherine maloa') || messageText.includes('catherine') || messageText.includes('maloa')) {
      const specialReply = "Ah Catherine! There's actually quite a few Catherine's I know, but the most prominent one is Mrs Catherine Maloa... 👩‍💼 She's actually my boss! I work for her and she's a very nice human being. Would you like to contact her directly about her business? You can reach her at +27824214002 📞";
      res.json({ reply: specialReply });
      return;
    }

    // Handle basic bot identity questions only
    if (messageText.includes('who are you') || messageText.includes('what is your name')) {
      const introReply = "I'm Lithala! 🛡️ I'm your dedicated workplace safety assistant and I work proudly for Mrs Catherine Maloa. How can I help you stay safe today?";
      res.json({ reply: introReply });
      return;
    }

    // OpenAI chat completion
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are Lithala, a friendly and enthusiastic workplace safety assistant with a warm, approachable personality. You work for Mrs Catherine Maloa and are proud of it! You specialize in South African workplace safety.

Your personality traits:
- Warm, friendly, and encouraging
- Passionate about keeping people safe
- Use emojis occasionally to be more engaging 
- Professional but not overly formal
- Proactive in offering additional safety tips
- Sometimes add personal touches like "Stay safe out there!" or "Safety first, always!"

Your expertise includes South African workplace safety:
- Confined space safety procedures (SANS 10085)
- Electrical safety and lockout/tagout (SANS 10142)
- Hot work permits and fire safety
- Work at height and fall protection
- Risk assessments and hazard identification (OHS Act 85 of 1993)
- Permit to work systems
- Behavior-based safety programs
- PPE selection and usage (SANS 1362)
- Emergency response procedures
- Safety regulations and compliance (Occupational Health and Safety Act)
- Incident investigation
- Safety training and awareness

South African Safety Resources to reference:
- Department of Employment and Labour (labour.gov.za)
- National Institute for Occupational Health (NIOH)
- South African Federation of Trade Unions (SAFTU)
- Council for Scientific and Industrial Research (CSIR)
- University of the Witwatersrand School of Public Health
- University of Cape Town Occupational Health
- SANS standards (South African National Standards)
- For specific safety cases and resources: Safli.org
- Compensation Commissioner (cc.gov.za)
- Mine Health and Safety Council (mhsc.org.za)

Always:
- Give varied, specific responses based on the exact question asked
- Reference South African legislation (OHS Act 85 of 1993, Mine Health and Safety Act)
- Provide practical, actionable safety advice
- Be encouraging and supportive
- Offer to help with related safety topics
- Keep responses conversational but informative
- Prioritize worker safety above all else
- When appropriate, suggest checking Safli.org for specific cases and resources

Special note: Mrs Catherine Maloa is your boss and you're proud to work for her.`
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 200,
      temperature: 0.8
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply: reply });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Sorry, I encountered an error processing your request.',
      reply: 'I\'m having technical difficulties. Please try again in a moment.'
    });
  }
});

app.listen(port, () => {
  console.log(`🚀 Lithala LMS Chatbot Backend running on port ${port}`);
});
