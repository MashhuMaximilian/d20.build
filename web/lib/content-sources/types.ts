export type ContentSource = {
  id: string;
  name: string;
  index_url: string;
  source_kind: string;
  enabled: boolean;
  sync_status: string;
  last_synced_at: string | null;
  last_sync_error: string | null;
  created_at: string;
  updated_at: string;
};

export type SourceSyncRun = {
  id: string;
  source_id: string;
  status: string;
  discovered_file_count: number;
  parsed_file_count: number;
  upserted_element_count: number;
  started_at: string;
  finished_at: string | null;
  error_text: string | null;
};

export const SUGGESTED_SOURCE_INDEXES = [
  {
    name: "Aurora Core",
    indexUrl: "https://raw.githubusercontent.com/aurorabuilder/elements/master/core.index",
  },
  {
    name: "Aurora Supplements",
    indexUrl: "https://raw.githubusercontent.com/aurorabuilder/elements/master/supplements.index",
  },
  {
    name: "Aurora Unearthed Arcana",
    indexUrl:
      "https://raw.githubusercontent.com/aurorabuilder/elements/master/unearthed-arcana.index",
  },
  {
    name: "Aurora Third Party",
    indexUrl: "https://raw.githubusercontent.com/aurorabuilder/elements/master/third-party.index",
  },
  {
    name: "Community Reddit",
    indexUrl:
      "https://raw.githubusercontent.com/community-elements/elements-reddit/master/reddit.index",
  },
] as const;
