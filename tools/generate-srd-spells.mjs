import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

function decodeXml(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&apos;|&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function stripXmlComments(value) {
  return value.replace(/<!--[\s\S]*?-->/g, "");
}

function stripTags(value) {
  return decodeXml(value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

function parseAttributes(tag) {
  const attributes = {};
  const matches = tag.matchAll(/(\w+)="([^"]*)"/g);

  for (const match of matches) {
    attributes[match[1]] = decodeXml(match[2]);
  }

  return attributes;
}

function getTagContent(block, tagName) {
  const match = block.match(new RegExp(`<${tagName}>([\\s\\S]*?)</${tagName}>`, "i"));
  return match ? match[1].trim() : "";
}

function getWrappedBlock(block, tagName) {
  const match = block.match(new RegExp(`<${tagName}(?:\\s[^>]*)?>([\\s\\S]*?)</${tagName}>`, "i"));
  return match ? match[1] : "";
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

function parseRules(elementBlock) {
  const rulesBlock = getWrappedBlock(elementBlock, "rules");
  if (!rulesBlock) {
    return [];
  }

  const rules = [];

  for (const match of rulesBlock.matchAll(/<(grant|stat)\s+([^>]*)\/>/g)) {
    const kind = match[1];
    const attributes = parseAttributes(match[2]);

    if (kind === "grant" && attributes.type && attributes.id) {
      rules.push({
        kind: "grant",
        type: attributes.type,
        id: attributes.id,
        requirements: attributes.requirements,
        level: attributes.level ? Number(attributes.level) : undefined,
        prepared: attributes.prepared === "true",
        equipped: attributes.equipped === "true",
        alt: attributes.alt,
      });
    }

    if (kind === "stat" && attributes.name && attributes.value) {
      rules.push({
        kind: "stat",
        name: attributes.name,
        value: attributes.value,
        bonus: attributes.bonus,
        requirements: attributes.requirements,
        level: attributes.level ? Number(attributes.level) : undefined,
        alt: attributes.alt,
      });
    }
  }

  for (const match of rulesBlock.matchAll(/<select\s+([^>]*)>([\s\S]*?)<\/select>|<select\s+([^>]*)\/>/g)) {
    const rawAttributes = match[1] || match[3] || "";
    const attributes = parseAttributes(rawAttributes);
    const body = match[2] || "";
    const choices = [...body.matchAll(/<item\s+([^>]*)>([\s\S]*?)<\/item>/g)].map((item) => {
      const itemAttributes = parseAttributes(item[1]);
      return {
        id: itemAttributes.id ?? crypto.randomUUID(),
        value: decodeXml(item[2].trim()),
      };
    });

    if (attributes.type && attributes.name) {
      rules.push({
        kind: "select",
        type: attributes.type,
        name: attributes.name,
        supports: attributes.supports,
        choices: choices.length ? choices : undefined,
        requirements: attributes.requirements,
        number: attributes.number ? Number(attributes.number) : undefined,
        optional: attributes.optional === "true",
        level: attributes.level ? Number(attributes.level) : undefined,
        prepared: attributes.prepared === "true",
        equipped: attributes.equipped === "true",
        alt: attributes.alt,
      });
    }
  }

  return rules;
}

function parseSpellcasting(elementBlock) {
  const match = elementBlock.match(/<spellcasting\s+([^>]*)>([\s\S]*?)<\/spellcasting>|<spellcasting\s+([^>]*)\/>/i);
  if (!match) {
    return undefined;
  }

  const attributes = parseAttributes(match[1] || match[3] || "");
  const body = match[2] || "";

  return {
    name: attributes.name ?? undefined,
    ability: attributes.ability ?? undefined,
    prepare: attributes.prepare === "true",
    list: stripTags(getTagContent(body, "list")) || undefined,
  };
}

function parseAuroraElements(sourceUrl, xml) {
  const sourceName = stripTags(getTagContent(xml, "name")) || null;
  const sanitizedXml = stripXmlComments(xml);
  const elementMatches = [...sanitizedXml.matchAll(/<element\s+([^>]*)>([\s\S]*?)<\/element>/g)];
  const parsedElements = [];

  for (const match of elementMatches) {
    const attributes = parseAttributes(match[1]);
    const body = match[2];
    const descriptionMatch = body.match(/<description>([\s\S]*?)<\/description>/i);
    const descriptionHtml = descriptionMatch ? descriptionMatch[1].trim() : null;
    const descriptionText = descriptionHtml ? stripTags(descriptionHtml) : null;
    const prerequisite = stripTags(getTagContent(body, "prerequisite")) || null;
    const requirements = stripTags(getTagContent(body, "requirements")) || null;

    if (!attributes.id || !attributes.type || !attributes.name) {
      continue;
    }

    parsedElements.push({
      id: attributes.id,
      type: attributes.type,
      name: attributes.name,
      source: attributes.source ?? sourceName ?? "Player’s Handbook",
      source_url: sourceUrl,
      supports: parseSupports(body),
      description: descriptionText ?? "",
      descriptionHtml: descriptionHtml ?? undefined,
      prerequisite: prerequisite ?? undefined,
      requirements: requirements ?? undefined,
      rules: parseRules(body),
      setters: parseSetters(body),
      spellcasting: parseSpellcasting(body),
    });
  }

  return parsedElements;
}

async function main() {
  const repoRoot = path.resolve(new URL("..", import.meta.url).pathname);
  const inputPath = path.join(repoRoot, "aurora-elements/core/players-handbook/spells.xml");
  const outputPath = path.join(repoRoot, "web/lib/builtins/srd-spells.ts");
  const sourceUrl =
    "https://raw.githubusercontent.com/aurorabuilder/elements/master/core/players-handbook/spells.xml";

  const xml = await fs.readFile(inputPath, "utf8");
  const elements = parseAuroraElements(sourceUrl, xml).filter((element) => element.type === "Spell");

  const content = `import type { BuiltInElement } from "@/lib/builtins/types";\n\nexport const BUILT_IN_SRD_SPELL_ELEMENTS: readonly BuiltInElement[] = ${JSON.stringify(elements, null, 2)};\n`;
  await fs.writeFile(outputPath, content, "utf8");
  console.log(`Wrote ${elements.length} built-in SRD spells to ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
