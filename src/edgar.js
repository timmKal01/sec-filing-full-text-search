const UA = 'SecFilingFullTextSearch/0.1 (+contact: sec-fts-admin@example.com)';
const FTS_BASE = 'https://efts.sec.gov/LATEST/search-index';

const TRANSIENT_STATUSES = new Set([429, 500, 502, 503, 504]);
const MAX_ATTEMPTS = 4;

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function secFetch(url) {
    let lastError;
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
        let res;
        try {
            res = await fetch(url, { headers: { 'User-Agent': UA } });
        } catch (err) {
            lastError = err;
            if (attempt < MAX_ATTEMPTS) await sleep(1000 * 2 ** (attempt - 1));
            continue;
        }
        if (res.ok) return res;
        if (!TRANSIENT_STATUSES.has(res.status)) {
            throw new Error(`SEC full-text search request failed: ${url} (${res.status})`);
        }
        lastError = new Error(`SEC full-text search request failed: ${url} (${res.status})`);
        if (attempt < MAX_ATTEMPTS) await sleep(1000 * 2 ** (attempt - 1));
    }
    throw lastError;
}

function isoDate(d) {
    return d.toISOString().slice(0, 10);
}

export async function searchFilings({ query, forms, startDate, endDate, limit }) {
    const params = new URLSearchParams({
        q: query,
        startdt: isoDate(startDate),
        enddt: isoDate(endDate),
        size: String(Math.min(limit, 100)),
    });
    if (forms?.length) params.set('forms', forms.join(','));

    const res = await secFetch(`${FTS_BASE}?${params}`);
    const data = await res.json();
    const hits = data.hits?.hits ?? [];
    const totalMatches = data.hits?.total?.value ?? hits.length;

    const results = hits.slice(0, limit).map((hit) => {
        const s = hit._source;
        const cikNum = s.ciks?.[0]?.replace(/^0+/, '') || s.ciks?.[0];
        const accessionNoDashes = s.adsh.replace(/-/g, '');
        return {
            companyName: s.display_names?.[0] ?? null,
            cik: s.ciks?.[0] ?? null,
            form: s.form,
            rootForms: s.root_forms ?? [],
            items: s.items ?? [],
            filingDate: s.file_date,
            periodEnding: s.period_ending ?? null,
            fileDescription: s.file_description ?? null,
            accessionNumber: s.adsh,
            filingUrl: `https://www.sec.gov/Archives/edgar/data/${cikNum}/${accessionNoDashes}-index.htm`,
        };
    });

    return { results, totalMatches };
}
