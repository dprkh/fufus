import { readFileSync } from "node:fs";
import { join } from "node:path";
import MiniSearch from "minisearch";

interface Product {
	id: string;
	title: string;
	description: string;
	price: number;
	category: string;
	subcategories: string[];
	image_url: string;
	features: string[];
	average_rating: number;
	rating_count: number;
	store: string;
}

const products: Product[] = JSON.parse(
	readFileSync(join(process.cwd(), "..", "data", "products.json"), "utf-8"),
);

const miniSearch = new MiniSearch<Product>({
	fields: [
		"title",
		"category",
		"subcategories",
		"features",
		"description",
		"store",
	],
	storeFields: [
		"id",
		"title",
		"description",
		"price",
		"category",
		"subcategories",
		"image_url",
		"features",
		"average_rating",
		"rating_count",
		"store",
	],
	extractField: (document, fieldName) => {
		const value = document[fieldName as keyof Product];
		if (Array.isArray(value)) return value.join(" ");
		return value as string;
	},
	searchOptions: {
		boost: { title: 2 },
		fuzzy: 0.2,
		prefix: true,
	},
});

miniSearch.addAll(products);

const productsById = new Map(products.map((p) => [p.id, p]));

export { miniSearch, productsById };
