import { tool } from "ai";
import { z } from "zod";
import { miniSearch } from "../search-index";

export const searchProducts = tool({
	description:
		"Search for products in the catalog. Returns up to `limit` results. You can call this multiple times with different queries to refine results. Optional price range filtering is available via minPrice/maxPrice.",
	inputSchema: z.object({
		query: z.string().describe("Search query based on user intent"),
		category: z
			.enum([
				"AMAZON FASHION",
				"All Electronics",
				"Amazon Home",
				"Sports & Outdoors",
			])
			.optional()
			.describe("Optional category filter"),
		limit: z
			.number()
			.int()
			.min(1)
			.max(16)
			.default(16)
			.describe("Max results to return (default 16, max 16)"),
		offset: z
			.number()
			.int()
			.min(0)
			.optional()
			.default(0)
			.describe("Offset for pagination (default 0)"),
		minPrice: z
			.number()
			.min(0)
			.optional()
			.describe("Minimum price filter"),
		maxPrice: z
			.number()
			.min(0)
			.optional()
			.describe("Maximum price filter"),
	}),
	execute: async ({ query, category, limit, offset, minPrice, maxPrice }) => {
		const results = miniSearch.search(query, {
			filter: (result) => {
				if (category && result.category !== category) return false;
				if (minPrice != null && result.price < minPrice) return false;
				if (maxPrice != null && result.price > maxPrice) return false;
				return true;
			},
		});

		const sliced = results.slice(offset ?? 0, (offset ?? 0) + (limit ?? 8));

		const hits = sliced.map((r) => ({
			id: r.id as string,
			title: r.title as string,
			description: r.description as string,
			price: r.price as number,
			average_rating: r.average_rating as number,
			store: r.store as string,
		}));

		return hits;
	},
});
