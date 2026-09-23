# obsidian-links

Appends a **Links** section to the bottom of every note, showing collapsed callouts for
backlinks and outlinks. No syntax required in the notes -- the section appears automatically.

## Output

```
## Links

> [!example]- Backlinks (3)
> - [[Note A]]
> - [[Note B]]
> - [[Note C]]

> [!note]- Outlinks (12)
> - [[Note D]]
> - [[Note E]]
> - … and 7 more
```

Both callouts are collapsed by default. Empty callouts are omitted entirely.

## Settings

| Setting | Default | Description |
| --- | --- | --- |
| Section title | `Links` | Heading shown above the callouts |
| Limit | *(all)* | Max entries per callout; empty or 0 = no limit |
| Refresh interval | `500` | Debounce delay in ms for updates while editing |

## Link resolution

**Backlinks**: notes that contain a link pointing to the current note.

**Outlinks**: all links from the current note -- regular `[[...]]` links, embeds
(`![[...]]`), and frontmatter links -- deduplicated by resolved path. Self-links and
unresolved links are excluded.

Each entry shows a resolved display title, tried in this order:

1. `name` frontmatter
2. `title` frontmatter
3. First entry of `aliases` frontmatter
4. Raw filename (without extension)

## Deploy

```sh
ln -s ~/obsidian/.obsidian/plugins/obsidian-links dist
npm run build
```
