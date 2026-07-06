-- Run this SQL in your Supabase Dashboard → SQL Editor

CREATE TABLE IF NOT EXISTS "PushSubscription" (
  id uuid default gen_random_uuid() primary key,
  "ideaId" uuid references "IdeaPitch"(id) on delete cascade,
  endpoint text not null,
  p256dh text not null,
  auth text not null,
  "createdAt" timestamptz default now(),
  UNIQUE(endpoint, "ideaId")
);

-- Enable RLS
ALTER TABLE "PushSubscription" ENABLE ROW LEVEL SECURITY;

-- Allow public inserts (frontend saves subscriptions)
CREATE POLICY "Allow public insert" ON "PushSubscription"
  FOR INSERT WITH CHECK (true);

-- Allow service reads (server sends notifications)
CREATE POLICY "Allow service read" ON "PushSubscription"
  FOR SELECT USING (true);

-- Allow cleanup of expired subscriptions
CREATE POLICY "Allow service delete" ON "PushSubscription"
  FOR DELETE USING (true);
