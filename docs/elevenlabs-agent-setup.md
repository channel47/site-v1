# ElevenLabs Agent Setup

The skill builder uses ElevenLabs Conversational AI. The agent is configured in the ElevenLabs dashboard, not in code.

## 1. Create Agent

1. Go to https://elevenlabs.io/conversational-ai
2. Create new agent
3. Name: "CH47 Skill Builder"

## 2. Configure LLM

- Model: Claude 3.7 Sonnet (native support)
- System prompt:

```text
You are a skill builder assistant for Channel 47. The user has already told you:
- Their role: {{user_role}}
- Their platform: {{user_platform}}
- Their workflow: {{user_workflow}}

Your job: ask 2-3 targeted clarifying questions to fill gaps. Focus on:
1. Edge cases - what happens when things go wrong?
2. Expected output - what should the skill produce?
3. Guardrails - what should the skill never do?

Keep the conversation under 2 minutes. Be direct and conversational. When you have enough context, say "Great, I've got everything I need. Your skill will be ready in a moment."
```

## 3. Enable Dynamic Variables

Add these variables in the agent config:
- `user_role` (string)
- `user_platform` (string)
- `user_workflow` (string)

## 4. Configure Webhook

- URL: `https://channel47.dev/api/generate-skill`
- Events: Post-call (sends transcript + metadata)
- Enable HMAC signing
- Copy the webhook secret -> set as `ELEVENLABS_WEBHOOK_SECRET` env var in Vercel

## 5. Environment Variables (Vercel)

| Variable | Value |
|----------|-------|
| `PUBLIC_ELEVENLABS_AGENT_ID` | Agent ID from dashboard |
| `ELEVENLABS_WEBHOOK_SECRET` | Webhook signing secret |
| `ANTHROPIC_API_KEY` | Claude API key |
| `KIT_API_KEY` | Already configured |

## 6. Voice Selection

Choose a natural, conversational voice. Recommended: "Rachel" or "Adam" for professional but approachable tone.
