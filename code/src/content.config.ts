import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';

const guides = defineCollection({
	loader: glob({ 
		pattern: "**/*.md", 
		base: "./src/content/guides",
		generateId: ({ entry }) => entry.replace(/\.md$/, ''),
	}),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		brewMethod: z.enum(['v60', 'french-press', 'aeropress', 'chemex', 'cold-brew', 'espresso']),
		ratio: z.string(),
		difficulty: z.string(),
		prepTime: z.string(),
		brewTime: z.string(),
	}),
});

const blog = defineCollection({
	loader: glob({ 
		pattern: "**/*.md", 
		base: "./src/content/blog",
		generateId: ({ entry }) => entry.replace(/\.md$/, ''),
	}),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		author: z.string().default('Ratio Team'),
		image: z.string().optional(),
		tags: z.array(z.string()).default(['coffee']),
		relatedPosts: z.array(reference('blog')).optional(),
	}),
});

export const collections = { guides, blog };
