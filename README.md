# QuickQR

Create. Customize. Scan. A free, privacy-friendly QR code generator built with Next.js, TypeScript and Tailwind CSS.

## Status

| Phase | Scope | State |
| --- | --- | --- |
| 1 | Foundation: shell, theme, navigation, landing page | Implemented |
| 2 | Generator: 7 content types, validation, live preview | Implemented (see "Verification status") |
| 3 | Customization and export | Not started |
| 4 | Local history | Not started |
| 5 | Scanner and polish | Not started |

My QR Codes and Scanner are placeholders and say so on screen. The Generator has no download or copy buttons yet; those are Phase 3.

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
npm run lint
npm run typecheck
npm run test         # unit tests for formatters and validation (Node's built-in runner)
npm run build
```

Requires Node 20.9 or newer.

## How the generator is organised

| Layer | Files | Notes |
| --- | --- | --- |
| Types | `src/types/qr.ts` | Input shape per QR type, result type |
| Validation | `src/lib/qr-validation.ts` | URL, email, phone, Wi-Fi password, size limits |
| Formatting | `src/lib/qr-formatters.ts` | Pure string builders (`WIFI:`, `mailto:`, `tel:`, `sms:`, vCard 3.0) |
| Orchestration | `src/lib/qr-generator.ts` | Validate + format + summary + size rules, per type |
| Render options | `src/lib/qr-render.ts` | qr-code-styling options (fixed in Phase 2) |
| State | `src/hooks/useQRGenerator.ts` | Per-type form state, "visited field" error visibility |
| UI | `src/components/generator/*`, `src/components/ui/fields.tsx` | |

All QR content stays in the browser. `qr-code-styling` is loaded with a dynamic `import()` on the client only.

## Verification status (read this)

Automated, passing:

- 40 unit tests over formatters and validation (`npm run test`).
- Every payload format was encoded with OpenCV's QR encoder (level M) and decoded byte-exact by three independent decoders, at seven pixel scales.
- 51 real-browser (Chrome) checks of the generator UI: live preview, validation, state preservation, keyboard use, responsive layout at 375/768/1280px, light and dark.

Not yet verified, because it needs network access to install packages:

- `npm run lint` and `npm run build` have never been run on this code.
- The real `qr-code-styling` library has never been run on this code. The browser tests used a stand-in with the same `append()` / `update()` calls. Its option names and the `Options` types were written from documentation memory.
- Dependency versions in `package.json` were not checked against the registry.

### Manual scan checklist (do this once after `npm install`)

Open `/generator` and scan each code with the iPhone Camera app and an Android phone (Google Lens or the camera):

1. Website: `quickqr.dev`. It should offer to open `https://quickqr.dev/`.
2. Wi-Fi: use a real network, including one with `;` or `:` in the password. It should offer to join.
3. Email with a multi-line message. SMS with a prefilled message. Phone.
4. Contact: it should offer to add the contact with all fields.
5. Text containing non-English characters (for example Bengali) and an emoji. Check the text reads back correctly.
6. A long URL (about 300 characters) printed small, or viewed from a laptop screen at arm's length.

## Known risks to check on devices

- **Non-ASCII text.** The payload bytes are correct UTF-8, but whether `qr-code-styling` encodes non-ASCII characters as UTF-8 was not verified. If step 5 shows garbled text, this is the place to look.
- **SMS body on iOS.** The code uses the standard `sms:<number>?body=<text>` form. Some iOS versions have historically preferred `&body=`. Check step 3 on an iPhone.
- **Wi-Fi names/passwords that are all hex digits.** Some Android versions read these as raw hex unless quoted. The code does not quote them, because iOS may then keep the quotes.
