import { tool } from "ai";
import { z } from "zod";
import { productsById } from "../search-index";

export const showProducts = tool({
	description:
		"Display product cards to the user. Call after searching to show the best matching products. Maximum 3 products.",
	inputSchema: z.object({
		productIds: z
			.array(z.string())
			.min(1)
			.max(3)
			.describe("Product IDs to display (up to 3, chosen from search results)"),
	}),
	execute: async ({ productIds }) => {
		const products = productIds
			.map((id) => productsById.get(id))
			.filter((p) => p != null)
			.map(
				({
					id,
					title,
					description,
					price,
					image_url,
					average_rating,
					store,
				}) => ({
					id,
					title,
					description,
					price,
					image_url,
					average_rating,
					store,
				}),
			);
		return products;
	},
	toModelOutput: () => ({
		type: "text" as const,
		value: "Product cards displayed to user.",
	}),
});
