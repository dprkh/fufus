import { tool } from "ai";
import { z } from "zod";

export const showOptions = tool({
	description:
		"Present clickable option bubbles to the user so they can pick one by tapping. Use when the user should choose between a small set of discrete options (style, category, budget range, yes/no). The selected option text is returned as the tool output.",
	inputSchema: z.object({
		options: z
			.array(z.string())
			.min(2)
			.max(6)
			.describe(
				"Option labels to display as tappable bubbles (2-6 options)",
			),
	}),
	outputSchema: z
		.string()
		.describe("The option label the user selected"),
});
