-- Sprint 2 Section B: extend leads table for the Gacha Disclosure Pack capture.
-- Adds three optional columns the existing /api/capture endpoint now writes.
-- Run before deploying Sprint 2 to production.

alter table public.leads
  add column if not exists studio_name text,
  add column if not exists next_tool_idea text,
  add column if not exists usage_summary jsonb;

-- Index usage_summary keys we expect to query downstream from the Evo/Prime
-- warm-outreach pipeline.
create index if not exists leads_usage_summary_regions_idx
  on public.leads using gin ((usage_summary -> 'regions_covered'));

-- Backfill is unnecessary; existing rows have null which is the intended
-- "field not provided" sentinel.
