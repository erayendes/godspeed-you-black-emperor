# gybe.org

Static, English-language, non-commercial fan archive for Godspeed You! Black Emperor.

## Sections

- `/about`
- `/disco`
- `/disco/[album-slug]`
- `/shows`
- `/members`
- `/members/[member-slug]`
- `/crossing-paths`
- `/crossing-paths/[slug]`

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Show Updates

`src/data/shows.ts` is manually reviewed against Constellation's live page.

The planned free automation is included in `.github/workflows/check-live-source.yml`: it runs weekly and opens an issue when the official source appears to change. It does not publish changes automatically.
