# SEC Filing Full-Text Search: Any Form, Any Keyword

Search a keyword or exact phrase across every SEC filing type at once, not
just one form. Get back matching filings with company, form type, item
codes, and a direct link to the source document.

## Who this is for

- **Investors and analysts** searching for a specific phrase (a risk factor, a product name, a lawsuit) across a company's or the whole market's filings.
- **Journalists and researchers** tracking when and where a term first appears in SEC filings.
- **Competitive intelligence teams** monitoring what filings mention a competitor, technology, or event.

Every other SEC actor in this portfolio is scoped to one specific form type
(8-K material events, 13D/13G ownership stakes, 13F institutional
holdings, IPO registrations, Reg A+ offerings). This one searches
everything at once by keyword, for when you don't know which form type has
what you're looking for.

## Input

| Field | Type | Description |
|---|---|---|
| `query` | string | Keyword or exact phrase to search for, e.g. `"data breach"` or `"going concern"`. |
| `forms` | array | Limit to these form types, e.g. `["10-K", "8-K"]`. Leave empty to search all form types. |
| `daysBack` | integer (default `90`) | How many days back to search. |
| `maxResults` | integer (default `25`) | Maximum matching filings to return, most recent first. |

```json
{
  "query": "data breach",
  "forms": ["8-K"],
  "daysBack": 90
}
```

## Output

One record per matching filing:

```json
{
  "companyName": "CONDUENT Inc  (CNDT)  (CIK 0001677703)",
  "cik": "0001677703",
  "form": "8-K",
  "rootForms": ["8-K"],
  "items": ["8.01"],
  "filingDate": "2026-09-10",
  "periodEnding": "2026-09-10",
  "fileDescription": "8-K",
  "accessionNumber": "0001677703-26-000113",
  "filingUrl": "https://www.sec.gov/Archives/edgar/data/1677703/000167770326000113-index.htm"
}
```

## How it works

Direct calls to the official SEC EDGAR full-text search API
(`efts.sec.gov`), the same index that powers SEC.gov's own search page. No
key, no scraping, no proxy. Coverage starts in 2001, matching EDGAR's own
full-text search coverage window.

## Related products

- [SEC 8-K Material Event Tracker](https://github.com/timmKal01/sec-8k-material-event-tracker) — 8-K filings only, with item-code filtering and ticker lookup
- [SEC 13D/13G Ownership Tracker](https://github.com/timmKal01/sec-13d-ownership-tracker) — 5%+ ownership stake filings only
- [SEC 13F Institutional Holdings Tracker](https://github.com/timmKal01/sec-13f-institutional-holdings-tracker) — institutional fund holdings only
- [SEC IPO Registration Tracker](https://github.com/timmKal01/sec-ipo-registration-tracker) — new IPO registrations only
- [SEC Regulation A+ Offering Tracker](https://github.com/timmKal01/sec-reg-a-offering-tracker) — Reg A+ offerings only
