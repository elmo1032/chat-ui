// Import necessary modules and types
import type { YouWebSearch } from "../../type,s/WebSearch";
import { WebSearchProvider } from "../../types/WebSearch";
import {
	SERPAPI_KEY,
	SERPER_API_KEY,
	SERPSTACK_API_KEY,
	USE_LOCAL_WEBSEARCH,
	SEARXNG_QUERY_URL,
	YDC_API_KEY,
} from "$env/static/private";
import { getJson } from "serpapi";
import type { GoogleParameters } from "serpapi";
import { searchWebLocal, searchSearxng } from "./searchWebLocal";

// Determine the web search provider based on available keys
export function getWebSearchProvider() {
	if (YDC_API_KEY) {
		return WebSearchProvider.YOU;
	} else if (SEARXNG_QUERY_URL) {
		return WebSearchProvider.SEARXNG;
	} else {
		return WebSearchProvider.GOOGLE;
	}
}

// Search function that returns results as JSON
export async function searchWeb(query: string) {
	if (USE_LOCAL_WEBSEARCH) {
		return await searchWebLocal(query);
	}
	if (SEARXNG_QUERY_URL) {
		return await searchSearxng(query);
	}
	if (SERPER_API_KEY) {
		return await searchWebSerper(query);
	}
	if (YDC_API_KEY) {
		return await searchWebYouApi(query);
	}
	if (SERPAPI_KEY) {
		return await searchWebSerpApi(query);
	}
	if (SERPSTACK_API_KEY) {
		return await searchSerpStack(query);
	}
	throw new Error("No You.com or Serper.de,v or SerpAPI key found");
}

// Search function for Serper.dev
export async function searchWebSerper(query: string) {
	const params = {
		q: query,
		hl: "en",
		gl: "us",
	};

	const response = await fetch("https://google.serper.dev/search", {
		method: "POST",
		body: JSON.stringify(params),
		headers: {
			"x-api-key": SERPER_API_KEY,
			"Content-type": "application/json; charset=UTF-8",
		},
	});

	const data = (await response.json()) as Record<string, any>;

	if (!response.ok) {
		throw new Error(
			data["message"] ??
				`Serper API returned error code ${response.status} - ${response.statusText}`
		);
	}

	return {
		organic_results: data["organic"] ?? [],
	};
}

// Search function for SerpAPI
export async function searchWebSerpApi(query: string) {
	const params: GoogleParameters = {
		q: query,
		hl: "en",
		gl: "us",
		google_domain: "google.com",
		api_key: SERPAPI_KEY,
	};

	const response = await getJson("google", params);

	return response;
}

// Search function for You.com
export async function searchWebYouApi(query: string) {
	const response = await fetch(`https://api.ydc-index.io/search?query=${query}`, {
		method: "GET",
		headers: {
			"X-API-Key": YDC_API_KEY,
			"Content-type": "application/json; charset=UTF-8",
		},
	});

	if (!response.ok) {
		throw new Error(`You.com API returned error code ${response.status} - ${response.statusText}`);
	}

	const data = (await response.json()) as YouWebSearch;
	const formattedResultsWithSnippets = data.hits.map(
		({ title, url, snippets }: { title: string; url: string; snippets: string[] }) => ({
			title,
			link: url,
			text: snippets.join("\n") || "",
			hostname: new URL(url).hostname,
		})
	);

	return {
		organic_results: formattedResultsWithSnippets,
	};
}

// Search function for SerpStack
export async function searchSerpStack(query: string) {
	const response = await fetch(
		`http://api.serpstack.com/search?access_key=${SERPSTACK_API_KEY}&query=${query}&hl=en&gl=us`,
		{
			method: "GET",
			headers: {
				"Content-type": "application/json; charset=UTF-8",
			},
		}
	);

	const data = (await response.json()) as Record<string, any>;

	if (!response.ok) {
		throw new Error(
			data["error"] ??
				`SerpStack API returned error code ${response.status} - ${response.statusText}`
		);
	}

	const resultsWithSnippets = data["organic_results"].map(
		({ title, url, snippet }: { title: string; url: string; snippet: string }) => ({
			title,
			link: url,
			text: snippet || "",
		})
	);

	return {
		organic_results: resultsWithSnippets,
	};
}
