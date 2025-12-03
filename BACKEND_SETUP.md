# Network 20 - Backend Setup Guide

This guide will help you set up the Supabase backend for Network 20.

## Prerequisites

- A [Supabase](https://supabase.com) account (free tier works great)
- Node.js 18+ installed
- This repository cloned locally

## Quick Setup

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `network20` (or your preferred name)
   - **Database Password**: Generate a strong password (save this!)
   - **Region**: Choose closest to your users
5. Click "Create new project" and wait for setup (~2 minutes)

### 2. Get Your API Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (e.g., `https://abcdefghij.supabase.co`)
   - **anon public** key (starts with `eyJ...`)

### 3. Configure the App

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` with your credentials:
   ```
   EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### 4. Run the Database Migration

You have two options:

#### Option A: Using Supabase Dashboard (Easiest)

1. Go to your Supabase dashboard
2. Click **SQL Editor** in the sidebar
3. Click **New Query**
4. Copy the entire contents of `supabase/migrations/001_create_profiles.sql`
5. Paste into the SQL editor
6. Click **Run**

#### Option B: Using Supabase CLI

1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Link your project:
   ```bash
   supabase link --project-ref your-project-id
   ```

3. Run migrations:
   ```bash
   supabase db push
   ```

### 5. Configure Authentication (Optional)

By default, Supabase email authentication is enabled. To customize:

1. Go to **Authentication** → **Providers** in your dashboard
2. Configure email settings:
   - Enable/disable email confirmation
   - Customize email templates
3. (Optional) Enable social providers (Google, Apple, etc.)

### 6. Start the App

```bash
npm install
npm start
```

## Database Schema

The migration creates a `profiles` table with the following structure:

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Links to auth.users |
| display_name | TEXT | User's display name |
| tagline | TEXT | Short description |
| skills | TEXT[] | Array of skills |
| hours_available | INTEGER | Hours available for work |
| hours_frequency | TEXT | 'week' or 'month' |
| pay_preference | TEXT | 'hourly', 'project', 'salary', 'negotiable' |
| pay_rate | TEXT | Rate description |
| location | TEXT | User's location |
| contact_email | TEXT | Contact email |
| contact_phone | TEXT | Contact phone |
| social_links | JSONB | Array of social link objects |
| bio | TEXT | Full bio |
| avatar_url | TEXT | Profile picture URL |
| resume_url | TEXT | Resume/CV link |
| is_available | BOOLEAN | Availability status |
| is_public | BOOLEAN | Profile visibility |
| created_at | TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | Last update time |

## Row Level Security (RLS)

The migration sets up the following security policies:

- **Public profiles are viewable by everyone** - Anyone can see profiles where `is_public = true`
- **Users can view own profiles** - Authenticated users can always see their own profile
- **Users can insert own profile** - Users can only create profiles linked to their own user ID
- **Users can update own profile** - Users can only modify their own profile
- **Users can delete own profile** - Users can only delete their own profile

## Automatic Profile Creation

When a user signs up, a trigger automatically creates a profile with:
- Their email as `contact_email`
- Their display name from signup metadata (or email prefix if not provided)

## Local Development (No Backend)

The app works without Supabase configured! It will:
- Store profiles in device local storage (AsyncStorage)
- Skip authentication features
- Show appropriate messages on auth screens

This is great for:
- Quick demos
- Offline development
- Testing UI changes

## Troubleshooting

### "Backend Not Configured" message
- Make sure `.env` file exists with correct values
- Restart the Expo server after changing `.env`

### "Invalid API key" error
- Double-check your anon key is correct
- Make sure you copied the full key (it's long!)

### "Permission denied" errors
- The RLS policies might not be set up
- Re-run the migration SQL

### Email confirmation not working
- Check **Authentication** → **Email Templates** in Supabase
- Verify your SMTP settings if using custom domain

## Production Deployment

For production:

1. Enable email confirmation in Authentication settings
2. Set up a custom SMTP provider for reliable emails
3. Consider enabling social auth (Google, Apple)
4. Set up proper backup and monitoring

## Support

- [Supabase Documentation](https://supabase.com/docs)
- [Expo Documentation](https://docs.expo.dev)
- Open an issue in this repository

