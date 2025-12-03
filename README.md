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

## 📱 Tech Stack

- **Expo** - React Native framework
- **TypeScript** - Type-safe development
- **Expo Router** - File-based routing
- **React Native Web** - Web support
- **Local Storage** - AsyncStorage for data persistence
- **QR Code** - react-qr-code for profile sharing

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
│   └── profile/           # Profile views
├── src/
│   ├── components/        # Reusable components
│   │   ├── ui.tsx        # UI component library
│   │   └── QRCode.tsx    # QR code component
│   └── lib/
│       ├── theme.ts      # Design system
│       ├── store.ts      # Data storage
│       └── supabase.ts   # Supabase integration (ready)
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

## 🔮 Future Enhancements

- Supabase integration for cloud storage
- Real-time chat/forum
- Profile verification
- Advanced search filters
- Export profile as PDF
- Mobile app deployment

## 📄 License

Private project - All rights reserved

## 👤 Author

Built with ❤️ for workers who want a better way to network

---

**Network 20** - Connect. Work. Thrive.

