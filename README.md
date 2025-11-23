# Xyonz-AI - Smart AI Chat System

Website AI Chat modern yang dibangun dengan Next.js 15, TypeScript, dan Tailwind CSS.

## 🚀 Fitur Utama

### ✨ Landing Page Modern
- Animasi futuristik dengan efek fade-in, slide-in, dan neon glow
- Tema warna biru-ungu yang elegan
- Responsive design untuk mobile dan desktop
- Smooth scroll dan interaktif background

### 🔐 Sistem Autentikasi Lengkap
- Register dan Login user
- Role-based access (User & Admin)
- Password hashing dengan bcrypt
- JWT token authentication
- Session management

### 💬 AI Chat System
- Real-time chat dengan AI
- Menggunakan Cerebras API (llama3.1-8b model)
- Chat bubble modern dengan animasi
- Auto-scroll dan typing indicator
- History chat tersimpan

### 👥 User Dashboard
- Profil user
- Riwayat chat lengkap
- Chat interface yang modern
- Statistik penggunaan

### 🛡️ Admin Dashboard
- Manajemen semua user
- Monitoring chat logs
- Delete user dan chat
- Statistik lengkap (total users, chats, active users)
- Role-based access control

## 🛠️ Teknologi yang Digunakan

- **Frontend**: Next.js 15 dengan App Router
- **Backend**: Next.js API Routes
- **Database**: Prisma dengan SQLite
- **Styling**: Tailwind CSS + shadcn/ui
- **Authentication**: JWT + bcrypt
- **AI API**: Cerebras API melalui ZAI SDK
- **Icons**: Lucide React
- **TypeScript**: Full type safety

## 📋 Persyaratan Sistem

- Node.js 18+ 
- npm atau yarn
- Web browser modern

## 🚀 Cara Setup

### 1. Clone Repository
```bash
git clone <repository-url>
cd xyonz-ai
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Buat file `.env.local` di root directory:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key-here"
```

### 4. Setup Database
```bash
npm run db:push
```

### 5. Jalankan Development Server
```bash
npm run dev
```

Buka http://localhost:3000 di browser Anda.

## 👤 Membuat Admin User

Untuk membuat admin user pertama kali, jalankan:

```bash
curl -X POST http://localhost:3000/api/setup/admin \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

Atau gunakan tools seperti Postman dengan endpoint:
- **URL**: `POST /api/setup/admin`
- **Body**:
```json
{
  "username": "admin",
  "email": "admin@example.com", 
  "password": "admin123"
}
```

## 📁 Struktur Folder

```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── chat/
│   │   │   ├── history/
│   │   │   └── route.ts
│   │   ├── admin/
│   │   │   ├── users/
│   │   │   ├── chats/
│   │   │   └── route.ts
│   │   └── setup/
│   │       └── admin/
│   ├── dashboard/
│   │   └── page.tsx
│   ├── admin/
│   │   └── page.tsx
│   ├── login/
│   │   └── page.tsx
│   ├── page.tsx
│   ├── layout.tsx
│   └── globals.css
├── components/
│   └── ui/
├── lib/
│   └── db.ts
└── prisma/
    └── schema.prisma
```

## 🎨 UI/UX Features

### Landing Page
- Animated gradient background
- Mouse-following orb effects
- Smooth fade-in animations
- Feature cards dengan hover effects
- Responsive navigation

### Chat Interface
- Modern chat bubbles
- User messages (white background)
- AI messages (blue neon background)
- Typing indicator animation
- Auto-scroll to latest message
- Message timestamps

### Dashboard
- Tab-based navigation
- Real-time statistics
- Data tables dengan sorting
- Responsive grid layout
- Dark theme dengan glassmorphism

## 🔒 Security Features

- Password hashing dengan bcrypt
- JWT token authentication
- SQL injection prevention dengan Prisma
- XSS protection
- CORS configuration
- Input validation

## 📊 Database Schema

### Users Table
- id (String, Primary Key)
- username (String, Unique)
- email (String, Unique)
- password (String, Hashed)
- role (Enum: USER, ADMIN)
- createdAt (DateTime)
- updatedAt (DateTime)

### Chats Table
- id (String, Primary Key)
- userId (String, Foreign Key)
- message (String)
- response (String)
- timestamp (DateTime)

## 🚀 Deployment

### Build untuk Production
```bash
npm run build
npm start
```

### Environment Variables untuk Production
```env
DATABASE_URL="your-production-database-url"
JWT_SECRET="your-production-jwt-secret"
NODE_ENV="production"
```

## 🤝 Cara Penggunaan

### Untuk User Biasa:
1. Buka halaman utama
2. Klik "Login" atau "Mulai Chat AI"
3. Register jika belum punya akun
4. Login dengan username/password
5. Mulai chat dengan AI di dashboard

### Untuk Admin:
1. Login dengan akun admin
2. Akan otomatis redirect ke `/admin`
3. Monitor users, chat logs, dan statistik
4. Manage user dan chat data

## 🐛 Troubleshooting

### Common Issues:

1. **Database connection error**
   - Pastikan `DATABASE_URL` di `.env.local` benar
   - Jalankan `npm run db:push` untuk setup database

2. **JWT token error**
   - Pastikan `JWT_SECRET` di `.env.local` terisi
   - Clear browser localStorage jika ada token lama

3. **AI chat not working**
   - Pastikan ZAI SDK terinstall dengan benar
   - Check network connection

## 📄 License

MIT License - Developed by Lucky Herlinno Putra

## 🤝 Support

Jika ada masalah atau pertanyaan, silakan contact developer atau buka issue di repository.