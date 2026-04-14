import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(process.cwd(), "..");
const OUTPUT = path.resolve(process.cwd(), "lib/builtins/generated-srd-items.ts");

const SOURCE_FILES = [
  "aurora-elements/core/players-handbook/items/items-armor.xml",
  "aurora-elements/core/players-handbook/items/items-gear.xml",
  "aurora-elements/core/players-handbook/items/items-instrument.xml",
  "aurora-elements/core/players-handbook/items/items-mounts.xml",
  "aurora-elements/core/players-handbook/items/items-packs.xml",
  "aurora-elements/core/players-handbook/items/items-tools.xml",
  "aurora-elements/core/players-handbook/items/items-weapons.xml",
  "aurora-elements/core/dungeon-masters-guide/items/items-armor.xml",
  "aurora-elements/core/dungeon-masters-guide/items/items-firearms.xml",
  "aurora-elements/core/dungeon-masters-guide/items/items-gifts.xml",
  "aurora-elements/core/dungeon-masters-guide/items/items-potions.xml",
  "aurora-elements/core/dungeon-masters-guide/items/items-poison.xml",
  "aurora-elements/core/dungeon-masters-guide/items/items-rings.xml",
  "aurora-elements/core/dungeon-masters-guide/items/items-rods.xml",
  "aurora-elements/core/dungeon-masters-guide/items/items-staffs.xml",
  "aurora-elements/core/dungeon-masters-guide/items/items-treasure.xml",
  "aurora-elements/core/dungeon-masters-guide/items/items-vehicles.xml",
  "aurora-elements/core/dungeon-masters-guide/items/items-wands.xml",
  "aurora-elements/core/dungeon-masters-guide/items/items-weapons.xml",
  "aurora-elements/core/dungeon-masters-guide/items/items-wondrous.xml",
];

function decodeXml(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&apos;|&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function stripComments(value) {
  return value.replace(/<!--[\s\S]*?-->/g, "");
}

function stripTags(value) {
  return decodeXml(value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

function parseAttributes(tag) {
  const attributes = {};
  for (const match of tag.matchAll(/(\w+)="([^"]*)"/g)) {
    attributes[match[1]] = decodeXml(match[2]);
  }
  return attributes;
}

function getWrappedBlock(block, tagName) {
  const match = block.match(new RegExp(`<${tagName}(?:\\s[^>]*)?>([\\s\\S]*?)</${tagName}>`, "i"));
  return match ? match[1] : "";
}

function getTagContent(block, tagName) {
  const match = block.match(new RegExp(`<${tagName}>([\\s\\S]*?)</${tagName}>`, "i"));
  return match ? match[1].trim() : "";
}

function parseSupports(elementBlock) {
  const wrapped = getTagContent(elementBlock, "supports");
  if (!wrapped) {
    return [];
  }

  return wrapped
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function parseSetters(elementBlock) {
  const settersBlock = getWrappedBlock(elementBlock, "setters");
  if (!settersBlock) {
    return [];
  }

  return [...settersBlock.matchAll(/<set\s+([^>]*)>([\s\S]*?)<\/set>/g)].map((match) => {
    const attributes = parseAttributes(match[1]);
    return {
      name: attributes.name ?? "",
      value: decodeXml(match[2].trim()),
      type: attributes.type,
      modifier: attributes.modifier,
      alt: attributes.alt,
    };
  });
}

function parseElements(sourceUrl, xml) {
  const sourceName = stripTags(getTagContent(xml, "name")) || null;
  const elementMatches = [...xml.matchAll(/<element\s+([^>]*)>([\s\S]*?)<\/element>/g)];
  const parsed = [];

  for (const match of elementMatches) {
    const attributes = parseAttributes(match[1]);
    const body = match[2];
    if (!attributes.id || !attributes.type || !attributes.name) {
      continue;
    }
    if (!["Item", "Weapon", "Armor", "Magic Item"].includes(attributes.type)) {
      continue;
    }

    const descriptionMatch = body.match(/<description>([\s\S]*?)<\/description>/i);
    const descriptionHtml = descriptionMatch ? descriptionMatch[1].trim() : "";
    const setters = parseSetters(body);
    const setterMap = Object.fromEntries(setters.map((setter) => [setter.name, setter.value]));

    parsed.push({
      id: attributes.id,
      type: attributes.type,
      name: attributes.name,
      source: attributes.source ?? sourceName ?? "SRD",
      sourceUrl,
      description: descriptionHtml ? stripTags(descriptionHtml) : "",
      descriptionHtml: descriptionHtml || undefined,
      supports: parseSupports(body),
      category: setterMap.category ?? "",
      subtype: setterMap.type ?? "",
      rarity: setterMap.rarity ?? "",
      cost: setterMap.cost ?? "",
      weight: setterMap.weight ?? "",
      slot: setterMap.slot ?? "",
      attunement: setterMap.attunement ?? "",
    });
  }

  return parsed;
}

const items = [];
for (const relativePath of SOURCE_FILES) {
  const absolutePath = path.resolve(ROOT, relativePath);
  const xml = fs.readFileSync(absolutePath, "utf8");
  items.push(...parseElements(relativePath, stripComments(xml)));
}

items.sort((left, right) => left.name.localeCompare(right.name) || left.source.localeCompare(right.source));

const output = `export const BUILT_IN_SRD_ITEM_ELEMENTS = ${JSON.stringify(
  items,
  null,
  2,
)} as const;\n`;

fs.writeFileSync(OUTPUT, output);
console.log(`Wrote ${items.length} built-in item records to ${OUTPUT}`);
