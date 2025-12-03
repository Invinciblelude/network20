# Network 20

**A better LinkedIn for workers** - A free, public networking platform where people showcase their skills, availability, and how they want to get paid.

## 🌟 Features

- **Network Cards** - Create beautiful digital business cards
- **QR Codes** - Each profile gets a scannable QR code for easy sharing
- **Resume Links** - Add your resume URL to your profile
- **Multi-Card Support** - Create multiple cards for different purposes
- **Public Directory** - Browse and search all profiles
- **Skills & Availability** - Show what you can do and when you're available
- **Pay Preferences** - Set your preferred payment method and rates
- **Authentication** - Secure signup/login with email (powered by Supabase)
- **Cloud Sync** - Profiles sync across devices when logged in
- **100% Free** - No premium tiers, no hidden features

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run on web
npm run web

# Run on iOS
npm run ios

# Run on Android
npm run android
```

## ⚙️ Backend Setup (Optional)

The app works fully offline with local storage. To enable cloud features:

1. Create a free [Supabase](https://supabase.com) project
2. Copy `.env.example` to `.env`
3. Add your Supabase credentials
4. Run the migration in `supabase/migrations/001_create_profiles.sql`

See **[BACKEND_SETUP.md](./BACKEND_SETUP.md)** for detailed instructions.

## 📱 Tech Stack

- **Expo** - React Native framework
- **TypeScript** - Type-safe development
- **Expo Router** - File-based routing
- **React Native Web** - Web support
- **Supabase** - Backend (authentication, database, storage)
- **AsyncStorage** - Local data persistence (offline fallback)
- **react-qr-code** - QR code generation

## 🎨 Design

- **Dark Theme** - Deep navy/black backgrounds
- **Coral Accents** - Warm, inviting primary color (#FF6B4A)
- **Mint Highlights** - Electric mint for accents (#00F5D4)
- **Brutalist Meets Warm** - Bold, distinctive design

## 📋 Project Structure

```
network20/
├── app/                    # Expo Router pages
│   ├── index.tsx          # Home/Directory
│   ├── create.tsx         # Create profile flow
│   ├── my-cards.tsx       # Manage multiple cards
│   ├── auth/              # Authentication screens
│   │   ├── login.tsx     # Sign in
│   │   ├── signup.tsx    # Sign up
│   │   └── forgot-password.tsx
│   └── profile/           # Profile views
├── src/
│   ├── components/        # Reusable components
│   │   ├── ui.tsx        # UI component library
│   │   └── QRCode.tsx    # QR code component
│   └── lib/
│       ├── theme.ts       # Design system
│       ├── store.ts       # Unified data layer
│       ├── supabase.ts    # Supabase client & API
│       └── database.types.ts  # TypeScript types
├── supabase/
│   └── migrations/        # Database migrations
└── assets/                # Images, icons
```

## 🎯 Core Concepts

### Network Cards
Each user can create one or more "Network Cards" that include:
- Display name (real name, alias, or business name)
- Tagline (what you do)
- Skills (searchable list)
- Availability (hours per week/month)
- Pay preferences (hourly, project, salary, negotiable)
- Contact info (email, phone, social links)
- Resume URL
- Bio

### QR Codes
Every profile automatically gets a QR code that links directly to their Network 20 card. Perfect for:
- Business cards
- Resumes
- Networking events
- Social media profiles

### Dual-Mode Operation
- **With Supabase**: Full authentication, cloud sync, real-time updates
- **Without Supabase**: Local-only mode with AsyncStorage (great for demos)

## 🔒 Security

When Supabase is configured:
- Row Level Security (RLS) ensures users can only modify their own data
- Public profiles are viewable by anyone
- Private profiles are only visible to the owner
- Passwords are hashed and managed by Supabase Auth

## 🔮 Future Enhancements

- Social login (Google, Apple)
- Real-time chat/forum
- Profile verification badges
- Advanced search filters
- Export profile as PDF
- Mobile app deployment to App Store/Play Store

## 📄 License

Private project - All rights reserved

## 👤 Author

Built with ❤️ for workers who want a better way to network

---

**Network 20** - Connect. Work. Thrive.
