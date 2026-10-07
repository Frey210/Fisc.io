-- Fisc.io Database Schema (Supabase PostgreSQL)
-- Phase 1: Foundation & Database

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Custom Types & ENUMs
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'transaction_type') THEN
        CREATE TYPE transaction_type AS ENUM ('INCOME', 'EXPENSE', 'TRANSFER');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'transaction_source') THEN
        CREATE TYPE transaction_source AS ENUM ('telegram_ocr', 'telegram_text', 'web_manual');
    END IF;
END $$;

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type transaction_type NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Transactions Table
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type transaction_type NOT NULL,
    amount NUMERIC(14, 2) NOT NULL CHECK (amount >= 0),
    date TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
    description TEXT,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    source transaction_source NOT NULL DEFAULT 'web_manual',
    confidence_score REAL CHECK (confidence_score >= 0.0 AND confidence_score <= 1.0),
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Telegram Links Table
CREATE TABLE IF NOT EXISTS public.telegram_links (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    telegram_chat_id BIGINT UNIQUE NOT NULL,
    linked_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. Indexes for Query Performance
CREATE INDEX IF NOT EXISTS idx_categories_user_id ON public.categories(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id_date ON public.transactions(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_category_id ON public.transactions(category_id);
CREATE INDEX IF NOT EXISTS idx_telegram_links_chat_id ON public.telegram_links(telegram_chat_id);

-- 6. Row Level Security (RLS)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.telegram_links ENABLE ROW LEVEL SECURITY;

-- Categories RLS Policies
CREATE POLICY "Users can view own categories"
    ON public.categories FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own categories"
    ON public.categories FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own categories"
    ON public.categories FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own categories"
    ON public.categories FOR DELETE
    USING (auth.uid() = user_id);

-- Transactions RLS Policies
CREATE POLICY "Users can view own transactions"
    ON public.transactions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions"
    ON public.transactions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own transactions"
    ON public.transactions FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own transactions"
    ON public.transactions FOR DELETE
    USING (auth.uid() = user_id);

-- Telegram Links RLS Policies
CREATE POLICY "Users can view own telegram link"
    ON public.telegram_links FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own telegram link"
    ON public.telegram_links FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own telegram link"
    ON public.telegram_links FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own telegram link"
    ON public.telegram_links FOR DELETE
    USING (auth.uid() = user_id);
