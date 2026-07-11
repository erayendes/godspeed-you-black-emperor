import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const html = await readFile(new URL("../dist/shows/index.html", import.meta.url), "utf8");
const structuredData = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)]
  .map((match) => JSON.parse(match[1]));
const events = structuredData.filter((entry) => entry["@type"] === "MusicEvent");

test("every music event includes Google's recommended event details", () => {
  assert.ok(events.length > 0, "expected at least one MusicEvent");

  for (const event of events) {
    assert.equal(event.endDate, event.startDate, `${event.name}: endDate`);
    assert.match(event.description, /Godspeed You! Black Emperor/, `${event.name}: description`);
    assert.deepEqual(event.image, ["https://gybe.org/images/site/live-stage.jpg"], `${event.name}: image`);
    assert.equal(event.offers?.["@type"], "Offer", `${event.name}: offers type`);
    assert.equal(event.offers?.url, event.url, `${event.name}: offers URL`);
    assert.equal(event.organizer?.["@type"], "Organization", `${event.name}: organizer type`);
    assert.ok(event.organizer?.name, `${event.name}: organizer name`);
    assert.ok(event.organizer?.url, `${event.name}: organizer URL`);
  }
});
