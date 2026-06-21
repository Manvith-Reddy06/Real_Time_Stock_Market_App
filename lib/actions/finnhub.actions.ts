'use server';

import {
    formatArticle,
    getDateRange,
    validateArticle,
} from '@/lib/utils';

const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';
const NEXT_PUBLIC_FINNHUB_API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY!;

const fetchJSON = async <T>(
    url: string,
    revalidateSeconds?: number
): Promise<T> => {
    const response = await fetch(
        url,
        revalidateSeconds !== undefined
            ? { cache: 'force-cache', next: { revalidate: revalidateSeconds } }
            : { cache: 'no-store' }
    );

    if (!response.ok) {
        throw new Error(
            `Finnhub request failed: ${response.status} ${response.statusText}`
        );
    }

    return response.json() as Promise<T>;
};

const dedupeKey = (article: RawNewsArticle): string =>
    String(article.id ?? article.url ?? article.headline);

const fetchGeneralNews = async (): Promise<MarketNewsArticle[]> => {
    const url = `${FINNHUB_BASE_URL}/news?category=general&token=${NEXT_PUBLIC_FINNHUB_API_KEY}`;
    const news = await fetchJSON<RawNewsArticle[]>(url, 3600);

    const seen = new Set<string>();
    const articles: MarketNewsArticle[] = [];

    for (const article of news) {
        if (!validateArticle(article)) continue;

        const key = dedupeKey(article);
        if (seen.has(key)) continue;

        seen.add(key);
        articles.push(formatArticle(article, false, undefined, articles.length));

        if (articles.length >= 6) break;
    }

    return articles;
};

const fetchSymbolNews = async (
    symbols: string[]
): Promise<MarketNewsArticle[]> => {
    const { from, to } = getDateRange(5);
    const cleanedSymbols = symbols
        .map((symbol) => symbol.trim().toUpperCase())
        .filter(Boolean);

    if (cleanedSymbols.length === 0) {
        return fetchGeneralNews();
    }

    const articles: MarketNewsArticle[] = [];
    const seen = new Set<string>();
    const newsBySymbol = new Map<string, RawNewsArticle[]>();
    const articlePointers = new Map<string, number>();

    for (let round = 0; round < 6; round++) {
        const symbol = cleanedSymbols[round % cleanedSymbols.length];

        if (!newsBySymbol.has(symbol)) {
            const url = `${FINNHUB_BASE_URL}/company-news?symbol=${encodeURIComponent(symbol)}&from=${from}&to=${to}&token=${NEXT_PUBLIC_FINNHUB_API_KEY}`;
            const news = await fetchJSON<RawNewsArticle[]>(url, 3600);
            newsBySymbol.set(
                symbol,
                news.filter((article) => validateArticle(article))
            );
            articlePointers.set(symbol, 0);
        }

        const symbolNews = newsBySymbol.get(symbol) ?? [];
        let pointer = articlePointers.get(symbol) ?? 0;

        while (pointer < symbolNews.length) {
            const article = symbolNews[pointer];
            pointer += 1;

            const key = dedupeKey(article);
            if (seen.has(key)) continue;

            seen.add(key);
            articles.push(
                formatArticle(article, true, symbol, articles.length)
            );
            articlePointers.set(symbol, pointer);
            break;
        }

        articlePointers.set(symbol, pointer);
    }

    if (articles.length === 0) {
        return fetchGeneralNews();
    }

    return articles.sort((a, b) => b.datetime - a.datetime);
};

export const getNews = async (
    symbols?: string[]
): Promise<MarketNewsArticle[]> => {
    try {
        if (symbols && symbols.length > 0) {
            return await fetchSymbolNews(symbols);
        }

        return await fetchGeneralNews();
    } catch (error) {
        console.error('Error fetching news from Finnhub:', error);
        throw new Error('Failed to fetch news');
    }
};
