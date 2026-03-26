import { createAgentUIStreamResponse } from "ai";

import { chatAgent } from "@/lib/agents/chat-agent";

export async function POST(req: Request) {
	const { messages } = await req.json();

	return createAgentUIStreamResponse({
		agent: chatAgent,
		uiMessages: messages,
	});
}
