/**
 * Rendering options for qr-code-styling.
 *
 * The quiet zone matters for scanning: `margin` is padding inside the image,
 * and the preview card adds more white padding around it. The colors are fixed
 * dark-on-white in every theme because inverted or low-contrast codes fail on
 * many scanners. Phase 3 will make colors and styles user-configurable.
 */
export const QR_PREVIEW_OPTIONS = {
  type: "svg",
  width: 320,
  height: 320,
  margin: 32,
  qrOptions: { errorCorrectionLevel: "M" },
  backgroundOptions: { color: "#ffffff" },
  dotsOptions: { color: "#000000", type: "square" },
  cornersSquareOptions: { color: "#000000", type: "square" },
  cornersDotOptions: { color: "#000000", type: "square" },
} as const;
