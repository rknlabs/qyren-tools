-- Sprint 2 Section B / followup-5: Report Bug shared component.
-- Creates the bug_reports table that the new /api/bug-report endpoint
-- writes into, plus a public storage bucket for screenshot uploads.
-- Run before deploying followup-5 to production.

create table public.bug_reports (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  tool_id text not null,
  description text not null check (length(description) >= 20),
  reporter_email text,
  screenshot_urls text[] not null default '{}',
  user_agent text,
  page_url text,
  -- Salted sha256 of the submitter's IP. Identifying info is not stored.
  -- Same IP hashes to the same value, which is enough for the per-hour
  -- rate-limit count without retaining raw IPs.
  submitter_ip_hash text,
  resolved boolean not null default false,
  resolution_notes text
);

create index bug_reports_created_at_idx on public.bug_reports (created_at desc);
create index bug_reports_tool_id_idx on public.bug_reports (tool_id);
create index bug_reports_resolved_idx on public.bug_reports (resolved) where resolved = false;
-- Rate-limit lookup: count rows from the same IP hash in the last hour.
create index bug_reports_rate_limit_idx
  on public.bug_reports (submitter_ip_hash, created_at desc)
  where submitter_ip_hash is not null;

alter table public.bug_reports enable row level security;

-- Anonymous inserts are allowed so the public endpoint can write without
-- elevation. In practice the /api/bug-report Vercel function uses the
-- service-role key and bypasses RLS, but the policy is here so a direct
-- client-side insert would also work if we ever switch architectures.
create policy "Anyone can insert bug reports"
  on public.bug_reports for insert
  with check (true);

-- No select policy means no anonymous select access. Service-role queries
-- via Supabase dashboard or admin tools bypass RLS.

-- Storage bucket for screenshots. Public read so the email notification
-- can link directly to the uploaded files without signed-URL bookkeeping.
insert into storage.buckets (id, name, public)
values ('bug-report-screenshots', 'bug-report-screenshots', true)
on conflict (id) do nothing;

create policy "Anyone can upload bug report screenshots"
  on storage.objects for insert
  with check (bucket_id = 'bug-report-screenshots');

create policy "Public read on bug report screenshots"
  on storage.objects for select
  using (bucket_id = 'bug-report-screenshots');
