import crypto from "node:crypto";

type ParsedSelectChoice = {
  id: string;
  value: string;
};

type ParsedRule =
  | {
      kind: "grant";
      type: string;
      id: string;
      requirements?: string;
      level?: number;
      prepared?: boolean;
      equipped?: boolean;
      alt?: string;
    }
  | {
      kind: "select";
      type: string;
      name: string;
      supports?: string;
      choices?: ParsedSelectChoice[];
      requirements?: string;
      number?: number;
      optional?: boolean;
      level?: number;
      prepared?: boolean;
      equipped?: boolean;
      alt?: string;
    }
  | {
      kind: "stat";
      name: string;
      value: string;
      bonus?: string;
      requirements?: string;
      level?: number;
      alt?: string;
    };

type ParsedSetter = {
  name: string;
  value: string;
  type?: string;
  modifier?: string;
  alt?: string;
};

export type ParsedAuroraElement = {
  elementId: string;
  elementType: string;
  name: string;
  sourceName: string | null;
  sourceUrl: string;
  supports: string[];
  setters: ParsedSetter[];
  rules: ParsedRule[];
  descriptionHtml: string | null;
  descriptionText: string | null;
  multiclass: Record<string, unknown> | null;
  spellcasting: Record<string, unknown> | null;
  rawElement: Record<string, unknown>;
};

function decodeXml(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&apos;|&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function stripTags(value: string) {
  return decodeXml(value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

function parseAttributes(tag: string) {
  const attributes: Record<string, string> = {};
  const matches = tag.matchAll(/(\w+)="([^"]*)"/g);

  for (const match of matches) {
    attributes[match[1]] = decodeXml(match[2]);
  }

  return attributes;
}

function getTagContent(block: string, tagName: string) {
  const match = block.match(new RegExp(`<${tagName}>([\\s\\S]*?)</${tagName}>`, "i"));
  return match ? match[1].trim() : "";
}

function getWrappedBlock(block: string, tagName: string) {
  const match = block.match(new RegExp(`<${tagName}(?:\\s[^>]*)?>([\\s\\S]*?)</${tagName}>`, "i"));
  return match ? match[1] : "";
}

function getSelfClosingTags(block: string, tagName: string) {
  return [...block.matchAll(new RegExp(`<${tagName}\\s+([^>]*?)\\/?\\s*>`, "g"))].map(
    (match) => parseAttributes(match[1]),
  );
}

function parseSupports(elementBlock: string) {
  const wrapped = getTagContent(elementBlock, "supports");
  if (!wrapped) {
    return [];
  }

  return wrapped
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function parseSetters(elementBlock: string): ParsedSetter[] {
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

function parseRules(elementBlock: string): ParsedRule[] {
  const rulesBlock = getWrappedBlock(elementBlock, "rules");

  if (!rulesBlock) {
    return [];
  }

  const rules: ParsedRule[] = [];

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

function parseMulticlass(elementBlock: string) {
  const match = elementBlock.match(/<multiclass\s+([^>]*)>([\s\S]*?)<\/multiclass>/i);

  if (!match) {
    return null;
  }

  const attributes = parseAttributes(match[1]);
  const body = match[2];

  return {
    id: attributes.id ?? null,
    prerequisite: stripTags(getTagContent(body, "prerequisite")),
    requirements: stripTags(getTagContent(body, "requirements")),
    setters: parseSetters(`<setters>${getWrappedBlock(body, "setters")}</setters>`),
    rules: parseRules(`<rules>${getWrappedBlock(body, "rules")}</rules>`),
  };
}

function parseSpellcasting(elementBlock: string) {
  const match = elementBlock.match(/<spellcasting\s+([^>]*)>([\s\S]*?)<\/spellcasting>|<spellcasting\s+([^>]*)\/>/i);

  if (!match) {
    return null;
  }

  const attributes = parseAttributes(match[1] || match[3] || "");
  const body = match[2] || "";

  return {
    name: attributes.name ?? null,
    ability: attributes.ability ?? null,
    prepare: attributes.prepare === "true",
    list: stripTags(getTagContent(body, "list")),
  };
}

export function parseIndexUrls(indexUrl: string, xml: string) {
  const files = [...xml.matchAll(/<(?:file|obsolete)\s+([^>]*)\/>/g)].map((match) =>
    parseAttributes(match[1]),
  );

  return files
    .map((file) => file.url)
    .filter((url): url is string => Boolean(url))
    .map((url) => new URL(url, indexUrl).toString());
}

export function parseAuroraElements(sourceUrl: string, xml: string): ParsedAuroraElement[] {
  const sourceName = stripTags(getTagContent(xml, "name")) || null;
  const elementMatches = [...xml.matchAll(/<element\s+([^>]*)>([\s\S]*?)<\/element>/g)];
  const parsedElements: ParsedAuroraElement[] = [];

  for (const match of elementMatches) {
    const attributes = parseAttributes(match[1]);
    const body = match[2];
    const descriptionMatch = body.match(/<description>([\s\S]*?)<\/description>/i);
    const descriptionHtml = descriptionMatch ? descriptionMatch[1].trim() : null;
    const descriptionText = descriptionHtml ? stripTags(descriptionHtml) : null;

    if (!attributes.id || !attributes.type || !attributes.name) {
      continue;
    }

    parsedElements.push({
      elementId: attributes.id,
      elementType: attributes.type,
      name: attributes.name,
      sourceName: attributes.source ?? sourceName,
      sourceUrl,
      supports: parseSupports(body),
      setters: parseSetters(body),
      rules: parseRules(body),
      descriptionHtml,
      descriptionText,
      multiclass: parseMulticlass(body),
      spellcasting: parseSpellcasting(body),
      rawElement: {
        attributes,
        supports: parseSupports(body),
        setters: parseSetters(body),
        rules: parseRules(body),
      },
    });
  }

  return parsedElements;
}

export async function discoverAuroraFileUrls(indexUrl: string, visited = new Set<string>()) {
  if (visited.has(indexUrl)) {
    return [];
  }

  visited.add(indexUrl);

  const response = await fetch(indexUrl, {
    headers: {
      Accept: "application/xml,text/xml;q=0.9,*/*;q=0.8",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch index ${indexUrl}: ${response.status}`);
  }

  const xml = await response.text();
  const urls = parseIndexUrls(indexUrl, xml);
  const nested: string[] = [];
  const directXml: string[] = [];

  for (const url of urls) {
    if (url.endsWith(".index")) {
      nested.push(...(await discoverAuroraFileUrls(url, visited)));
    } else if (url.endsWith(".xml")) {
      directXml.push(url);
    }
  }

  return [...new Set([...directXml, ...nested])];
}

export async function fetchAuroraXmlFile(fileUrl: string) {
  const response = await fetch(fileUrl, {
    headers: {
      Accept: "application/xml,text/xml;q=0.9,*/*;q=0.8",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch xml ${fileUrl}: ${response.status}`);
  }

  const xml = await response.text();
  const contentHash = crypto.createHash("sha256").update(xml).digest("hex");
  return {
    xml,
    etag: response.headers.get("etag"),
    contentHash,
  };
}
