import { Actor, log } from 'apify';
import { searchFilings } from './edgar.js';

await Actor.init();

const input = (await Actor.getInput()) ?? {};
const { query, forms = [], daysBack = 90, maxResults = 25 } = input;

/** Must match the event name configured in this Actor's pay-per-event pricing on Apify. */
const FILING_SEARCH_EVENT = 'filing-search';

if (!query) {
    throw new Error('Input "query" is required, e.g. "data breach".');
}

const endDate = new Date();
const startDate = new Date(endDate.getTime() - daysBack * 24 * 60 * 60 * 1000);

log.info('Searching SEC full-text index', { query, forms, daysBack });

const { results, totalMatches } = await searchFilings({
    query,
    forms,
    startDate,
    endDate,
    limit: Math.min(maxResults, 100),
});

for (const filing of results) {
    await Actor.pushData(filing);
}

await Actor.charge({ eventName: FILING_SEARCH_EVENT });

log.info(`Pushed ${results.length} filing(s) of ${totalMatches} total match(es)`);

await Actor.exit();
