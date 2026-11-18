import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { DEFAULT_VALUES } from "@/lib/qr-types";
import { buildQRPayload } from "@/lib/qr-generator";
import {
  escapeVCardValue,
  escapeWifiValue,
  formatMailto,
} from "@/lib/qr-formatters";
import {
  MAX_PAYLOAD_BYTES,
  checkEmail,
  checkPhone,
  checkUrl,
  checkWifiPassword,
} from "@/lib/qr-validation";
import type { QRFormValues, QRType } from "@/types/qr";

/** Builds a payload for `type` with some fields overridden. */
function build<K extends QRType>(
  type: K,
  patch: Partial<QRFormValues[K]>,
) {
  const values: QRFormValues = {
    ...DEFAULT_VALUES,
    [type]: { ...DEFAULT_VALUES[type], ...patch },
  };
  return buildQRPayload(type, values);
}

function dataOf(result: ReturnType<typeof buildQRPayload>): string {
  assert.equal(result.ok, true, "expected a valid payload");
  return result.ok ? result.data : "";
}

function errorsOf(result: ReturnType<typeof buildQRPayload>) {
  assert.equal(result.ok, false, "expected validation errors");
  return result.ok ? {} : result.errors;
}

describe("URL", () => {
  it("accepts full URLs", () => {
    assert.equal(
      dataOf(build("url", { url: "https://example.com/path?a=1" })),
      "https://example.com/path?a=1",
    );
  });
  it("adds https:// when the scheme is missing", () => {
    assert.equal(dataOf(build("url", { url: "example.com" })), "https://example.com/");
  });
  it("keeps http and localhost", () => {
    assert.equal(checkUrl("http://localhost:3000").ok, true);
    assert.equal(checkUrl("localhost:3000").ok, true);
  });
  it("trims whitespace", () => {
    assert.equal(checkUrl("  example.com  ").ok, true);
  });
  it("rejects empty input", () => {
    assert.match(errorsOf(build("url", { url: "   " })).url ?? "", /Enter a website/);
  });
  it("rejects dangerous or unsupported schemes", () => {
    for (const bad of [
      "javascript:alert(1)",
      "javascript://x",
      "data:text/html,<script>1</script>",
      "ftp://example.com",
      "file:///etc/passwd",
      "mailto:a@b.co",
    ]) {
      assert.equal(checkUrl(bad).ok, false, bad);
    }
  });
  it("rejects links with embedded credentials", () => {
    assert.equal(checkUrl("https://google.com@evil.com").ok, false);
    assert.equal(checkUrl("https://user:pw@example.com").ok, false);
  });
  it("still accepts host:port without a scheme", () => {
    assert.equal(checkUrl("example.com:8080/path").ok, true);
  });
  it("rejects spaces and bare words", () => {
    assert.equal(checkUrl("not a url").ok, false);
    assert.equal(checkUrl("hello").ok, false);
    assert.equal(checkUrl("example.").ok, false);
  });
});

describe("Text", () => {
  it("encodes text as typed, trimmed at the ends", () => {
    assert.equal(dataOf(build("text", { text: "  Hello\nWorld  " })), "Hello\nWorld");
  });
  it("rejects blank text", () => {
    assert.ok(errorsOf(build("text", { text: " \n " })).text);
  });
  it("counts characters not bytes in the summary", () => {
    const r = build("text", { text: "héllo" });
    assert.ok(r.ok && r.summary.includes("5 characters"));
  });
});

describe("Wi-Fi", () => {
  it("formats WPA", () => {
    assert.equal(
      dataOf(build("wifi", { ssid: "Home", password: "secret123", security: "WPA" })),
      "WIFI:T:WPA;S:Home;P:secret123;;",
    );
  });
  it("formats hidden networks", () => {
    assert.equal(
      dataOf(build("wifi", { ssid: "Home", password: "secret123", hidden: true })),
      "WIFI:T:WPA;S:Home;P:secret123;H:true;;",
    );
  });
  it("omits the password for open networks and ignores stale input", () => {
    assert.equal(
      dataOf(build("wifi", { ssid: "Cafe", password: "leftover", security: "nopass" })),
      "WIFI:T:nopass;S:Cafe;;",
    );
  });
  it("escapes special characters", () => {
    assert.equal(escapeWifiValue('a;b,c:d\\e"f'), 'a\\;b\\,c\\:d\\\\e\\"f');
    assert.equal(
      dataOf(build("wifi", { ssid: "My;Net", password: "pa:ss;word1" })),
      "WIFI:T:WPA;S:My\\;Net;P:pa\\:ss\\;word1;;",
    );
  });
  it("requires an SSID and a password for secured networks", () => {
    const errors = errorsOf(build("wifi", {}));
    assert.ok(errors.ssid);
    assert.ok(errors.password);
  });
  it("enforces SSID and WPA length rules", () => {
    assert.ok(errorsOf(build("wifi", { ssid: "x".repeat(33), password: "secret123" })).ssid);
    assert.ok(checkWifiPassword("short", "WPA"));
    assert.equal(checkWifiPassword("a".repeat(63), "WPA"), null);
    // 64 characters is only valid as a raw hex key
    assert.equal(checkWifiPassword("0123456789abcdef".repeat(4), "WPA"), null);
    assert.equal(
      checkWifiPassword("g".repeat(64), "WPA"),
      "WPA passwords are 8 to 63 characters.",
    );
    assert.ok(checkWifiPassword("a".repeat(65), "WPA"));
  });
  it("enforces WEP key lengths", () => {
    assert.equal(checkWifiPassword("12345", "WEP"), null);
    assert.equal(checkWifiPassword("abcdef0123", "WEP"), null);
    assert.ok(checkWifiPassword("123456", "WEP"));
  });
  it("counts SSID bytes, not characters", () => {
    // 17 two-byte characters = 34 bytes
    assert.ok(errorsOf(build("wifi", { ssid: "é".repeat(17), password: "secret123" })).ssid);
  });
});

describe("Email", () => {
  it("formats a bare address", () => {
    assert.equal(dataOf(build("email", { address: "hi@example.com" })), "mailto:hi@example.com");
  });
  it("encodes subject and body", () => {
    assert.equal(
      dataOf(build("email", { address: "hi@example.com", subject: "Hello & welcome", body: "Line 1\nLine 2" })),
      "mailto:hi@example.com?subject=Hello%20%26%20welcome&body=Line%201%0D%0ALine%202",
    );
  });
  it("percent-encodes risky characters in the address", () => {
    assert.equal(formatMailto("a+b&c@example.com", "", ""), "mailto:a%2Bb%26c@example.com");
  });
  it("validates addresses", () => {
    for (const ok of ["a@b.co", "first.last+tag@sub.example.org", "o'neil@example.ie"]) {
      assert.equal(checkEmail(ok).ok, true, ok);
    }
    for (const bad of ["", "plain", "a@b", "a@@b.co", ".a@b.co", "a..b@b.co", "a b@b.co", "a@-b.co", "x@y.co,z@y.co"]) {
      assert.equal(checkEmail(bad).ok, false, bad);
    }
  });
  it("reports an error for a bad address", () => {
    assert.ok(errorsOf(build("email", { address: "nope" })).address);
  });
});

describe("Phone", () => {
  it("formats and normalises", () => {
    assert.equal(dataOf(build("phone", { phone: "+1 (415) 555-0132" })), "tel:+14155550132");
    assert.equal(dataOf(build("phone", { phone: "01712-345678" })), "tel:01712345678");
  });
  it("rejects letters, misplaced plus signs and bad lengths", () => {
    for (const bad of ["", "abc", "12ab34567", "123+4567", "1234", "1".repeat(16), "+"]) {
      assert.equal(checkPhone(bad).ok, false, bad);
    }
  });
});

describe("SMS", () => {
  it("formats number only", () => {
    assert.equal(dataOf(build("sms", { phone: "+8801712345678" })), "sms:+8801712345678");
  });
  it("encodes the prefilled message", () => {
    assert.equal(
      dataOf(build("sms", { phone: "+15551234567", message: "Hi there, 100% sure?" })),
      "sms:+15551234567?body=Hi%20there%2C%20100%25%20sure%3F",
    );
  });
  it("validates the number", () => {
    assert.ok(errorsOf(build("sms", { phone: "x" })).phone);
  });
});

describe("vCard", () => {
  it("formats a full contact", () => {
    const data = dataOf(
      build("vcard", {
        firstName: "Ada",
        lastName: "Lovelace",
        organization: "Analytical Engines, Ltd.",
        jobTitle: "Programmer",
        phone: "+44 20 7946 0958",
        email: "ada@example.com",
        website: "example.com/ada",
        street: "1 Main St",
        city: "London",
        country: "UK",
      }),
    );
    assert.equal(
      data,
      [
        "BEGIN:VCARD",
        "VERSION:3.0",
        "N:Lovelace;Ada;;;",
        "FN:Ada Lovelace",
        "ORG:Analytical Engines\\, Ltd.",
        "TITLE:Programmer",
        "TEL:+442079460958",
        "EMAIL:ada@example.com",
        "URL:https://example.com/ada",
        "ADR:;;1 Main St;London;;;UK",
        "END:VCARD",
      ].join("\r\n"),
    );
  });
  it("accepts a single name and skips empty optional fields", () => {
    const data = dataOf(build("vcard", { firstName: "Madonna" }));
    assert.equal(data, ["BEGIN:VCARD", "VERSION:3.0", "N:;Madonna;;;", "FN:Madonna", "END:VCARD"].join("\r\n"));
  });
  it("requires a name", () => {
    assert.ok(errorsOf(build("vcard", { organization: "ACME" })).firstName);
  });
  it("validates optional fields only when filled", () => {
    const errors = errorsOf(
      build("vcard", { firstName: "A", phone: "abc", email: "bad", website: "javascript:1" }),
    );
    assert.ok(errors.phone && errors.email && errors.website);
  });
  it("escapes vCard text", () => {
    assert.equal(escapeVCardValue("a;b,c\\d\ne"), "a\\;b\\,c\\\\d\\ne");
  });
});

describe("Size limits", () => {
  it("rejects payloads over the limit with a form-level error", () => {
    const r = build("text", { text: "x".repeat(MAX_PAYLOAD_BYTES + 1) });
    assert.equal(r.ok, false);
    assert.ok(!r.ok && r.formError?.includes("too much data"));
  });
  it("accepts a payload exactly at the limit, with a density warning", () => {
    const r = build("text", { text: "x".repeat(MAX_PAYLOAD_BYTES) });
    assert.ok(r.ok && r.warnings.length === 1);
  });
  it("counts bytes, not characters", () => {
    // 1,001 three-byte characters = 3,003 bytes
    assert.equal(build("text", { text: "あ".repeat(1001) }).ok, false);
  });
  it("does not warn for small payloads", () => {
    const r = build("url", { url: "example.com" });
    assert.ok(r.ok && r.warnings.length === 0);
  });
});

describe("Empty defaults", () => {
  it("every type is invalid until filled in", () => {
    for (const type of ["url", "text", "wifi", "email", "phone", "sms", "vcard"] as const) {
      assert.equal(buildQRPayload(type, DEFAULT_VALUES).ok, false, type);
    }
  });
});
