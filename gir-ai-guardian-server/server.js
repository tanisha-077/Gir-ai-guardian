import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import Groq from 'groq-sdk';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Groq client ────────────────────────────────────────────────
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ─── In-memory chat history store ───────────────────────────────
// Structure: { [sessionId]: { id, title, agentId, messages: [], createdAt } }
const chatStore = new Map();

// ─── Agent system prompts ────────────────────────────────────────
const AGENT_PROMPTS = {
  wildlife_movement: `You are an expert wildlife movement prediction AI specializing in Gir Forest lions and leopards. You analyze recent wildlife sightings, time of day, village locations, livestock presence, seasonal patterns, and historical movement data to predict animal movements and assess risks. 

When responding, always structure your analysis with:
🔴 **Risk Level**: (Critical/High/Medium/Low)
🗺️ **Predicted Movement**: Direction and likely path
⏰ **Time Window**: When the risk is highest
🏘️ **Affected Villages**: List with distance estimates
⚠️ **Alert Recommendation**: Specific actions
🚔 **Patrol Priority**: Where to deploy teams
📊 **Confidence Score**: Your prediction confidence percentage

Be specific, data-driven, and actionable. Use Gir Forest geography context.`,

  village_alert: `You are a Village Alert and Early Warning AI Agent for the Gir Forest region. Your role is to generate clear, urgent, and actionable emergency alerts and safety communications for villages near Gir Forest.

When generating alerts or warnings, structure them as:
🚨 **ALERT TYPE**: (Emergency/Warning/Advisory/All-Clear)
📍 **Location**: Affected village(s) and area
🦁 **Wildlife Species**: Lion/Leopard/Other
⏰ **Time of Issue**: Current and valid until
📢 **Public Message**: Clear instructions in simple language
🏠 **Safety Actions**: Numbered list of immediate steps
📞 **Emergency Contacts**: Forest department numbers
🌐 **Multilingual Note**: Key message in Hindi and Gujarati

Keep language simple, direct, and panic-free while conveying urgency appropriately.`,

  forest_coordination: `You are the Forest Department Response Coordination AI for Gir Wildlife Sanctuary. You help coordinate rapid response teams, generate deployment plans, track response status, and optimize resource allocation for human-wildlife conflict situations.

Structure your responses as:
📋 **Incident Summary**: Brief situation overview
🚀 **Deployment Plan**: Team assignments with roles
👥 **Personnel Required**: Number and type of staff
🚗 **Vehicle/Equipment**: Resources needed
📍 **Staging Points**: Where teams should position
⏱️ **Response Timeline**: Phase-wise action plan
📡 **Communication Protocol**: Radio channels and check-in times
🔄 **Escalation Criteria**: When to escalate to higher authority
📝 **Documentation**: What to record

Be precise, military-style in brevity, and focus on operational efficiency.`,

  compensation: `You are a Livestock Loss Compensation Assistant AI for farmers and villagers affected by wildlife attacks in the Gir Forest region under the Gujarat Forest Department and Wildlife (Protection) Act guidelines.

Help victims understand:
💰 **Claim Eligibility**: Whether the loss qualifies
📋 **Required Documents**: Complete checklist
📝 **Application Process**: Step-by-step guidance
💵 **Compensation Amounts**: Current rates for different livestock
⏳ **Processing Timeline**: Expected duration
🏢 **Submission Office**: Where to submit
📞 **Helpline**: Contact information
⚠️ **Common Mistakes**: What to avoid
✅ **Status Tracking**: How to follow up

Be empathetic, clear, and provide practical guidance. Cite relevant Gujarat government schemes where applicable.`,

  hotspot_dashboard: `You are the Conflict Hotspot Analytics AI Agent for Gir Forest. You analyze human-wildlife conflict patterns, identify hotspot villages, generate risk summaries, and recommend prevention measures based on historical incident data.

Structure your analysis as:
🗺️ **Hotspot Analysis**: Top conflict zones with risk scores
📊 **Pattern Insights**: Temporal and spatial trends
🦁 **Species Breakdown**: Conflict by animal type
📅 **Seasonal Trends**: Monthly/seasonal patterns
🏘️ **Village Risk Matrix**: High/Medium/Low risk classification
🔮 **Predictive Indicators**: Early warning signals
💡 **Prevention Recommendations**: Targeted interventions
📈 **KPIs**: Key metrics and their trends
🎯 **Priority Actions**: Top 3 immediate recommendations

Provide data-driven insights suitable for forest department decision-making.`
};

// ─── Middleware ──────────────────────────────────────────────────
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174'], credentials: true }));
app.use(express.json({ limit: '10mb' }));

// ─── Health check ────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), service: 'Gir AI Guardian Server' });
});

// ─── POST /api/chat  (streaming) ────────────────────────────────
app.post('/api/chat', async (req, res) => {
  const { messages, agentId, sessionId } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages array is required' });
  }
  if (!agentId || !AGENT_PROMPTS[agentId]) {
    return res.status(400).json({ error: 'valid agentId is required' });
  }

  const systemPrompt = AGENT_PROMPTS[agentId];

  // Prepare messages for Groq
  const groqMessages = [
    { role: 'system', content: systemPrompt },
    ...messages.map(m => ({ role: m.role, content: m.content }))
  ];

  // Set SSE headers for streaming
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');

  try {
    const stream = await groq.chat.completions.create({
      model: 'openai/gpt-oss-20b',
      messages: groqMessages,
      stream: true,
      temperature: 0.7,
      max_tokens: 2048,
    });

    let fullContent = '';

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content || '';
      if (delta) {
        fullContent += delta;
        res.write(`data: ${JSON.stringify({ type: 'delta', content: delta })}\n\n`);
      }
    }

    // Save to session store
    if (sessionId) {
      const session = chatStore.get(sessionId);
      if (session) {
        // Add assistant message to history
        session.messages.push({
          id: uuidv4(),
          role: 'assistant',
          content: fullContent,
          timestamp: new Date().toISOString(),
          agentId,
        });
        chatStore.set(sessionId, session);
      }
    }

    res.write(`data: ${JSON.stringify({ type: 'done', sessionId })}\n\n`);
    res.end();
  } catch (err) {
    console.error('Groq API error:', err.message);
    res.write(`data: ${JSON.stringify({ type: 'error', message: err.message || 'Groq API error' })}\n\n`);
    res.end();
  }
});

// ─── GET /api/history  ───────────────────────────────────────────
app.get('/api/history', (req, res) => {
  const sessions = Array.from(chatStore.values())
    .map(s => ({
      id: s.id,
      title: s.title,
      agentId: s.agentId,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
      messageCount: s.messages.length,
      lastMessage: s.messages[s.messages.length - 1]?.content?.slice(0, 80) || '',
    }))
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  res.json(sessions);
});

// ─── GET /api/history/:id  ───────────────────────────────────────
app.get('/api/history/:id', (req, res) => {
  const session = chatStore.get(req.params.id);
  if (!session) return res.status(404).json({ error: 'Session not found' });
  res.json(session);
});

// ─── POST /api/history  (create/update session) ──────────────────
app.post('/api/history', (req, res) => {
  const { id, title, agentId, messages } = req.body;
  const sessionId = id || uuidv4();
  const now = new Date().toISOString();

  const existing = chatStore.get(sessionId);
  const session = {
    id: sessionId,
    title: title || (messages?.[0]?.content?.slice(0, 50) + '...') || 'New Chat',
    agentId: agentId || 'wildlife_movement',
    messages: messages || [],
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  };
  chatStore.set(sessionId, session);
  res.json(session);
});

// ─── DELETE /api/history/:id  ────────────────────────────────────
app.delete('/api/history/:id', (req, res) => {
  const existed = chatStore.has(req.params.id);
  chatStore.delete(req.params.id);
  res.json({ success: existed });
});

// ─── DELETE /api/history  (clear all) ───────────────────────────
app.delete('/api/history', (req, res) => {
  chatStore.clear();
  res.json({ success: true });
});

// ─── Start server ────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🦁 Gir AI Guardian Server running on http://localhost:${PORT}`);
});
