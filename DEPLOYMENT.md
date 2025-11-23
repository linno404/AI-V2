# Xyonz-AI Netlify Deployment Guide

## 🚀 Cara Deploy ke Netlify

### 1. Prerequisites
- Akun Netlify (gratis di https://app.netlify.com/)
- Git repository (GitHub, GitLab, dll)
- Node.js 18+ terinstall

### 2. Setup Environment Variables

#### Di Netlify Dashboard:
1. Login ke Netlify dashboard
2. Pilih site Anda atau buat site baru
3. Go to **Site settings > Environment variables**
4. Tambahkan environment variables berikut:

```
DATABASE_URL=file:./production.db
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-12345
CEREBRAS_API_KEY=your-cerebras-api-key-here
NEXTAUTH_URL=https://your-domain.netlify.app
NEXTAUTH_SECRET=your-nextauth-secret-here
```

### 3. Build Configuration

#### Update package.json untuk Netlify:
```json
{
  "scripts": {
    "build": "next build",
    "dev": "next dev"
  },
  "dependencies": {
    "@prisma/client": "^5.0.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.0"
  }
}
```

### 4. Deployment Steps

#### Method 1: Git Integration (Recommended)
1. **Push ke Git Repository:**
   ```bash
   git add .
   git commit -m "Ready for Netlify deployment"
   git push origin main
   ```

2. **Connect ke Netlify:**
   - Login ke Netlify dashboard
   - Click "New site from Git"
   - Pilih Git provider Anda
   - Pilih repository `xyonz-ai`
   - Configure build settings:
     - Build command: `npm run build`
     - Publish directory: `out`
   - Node version: `18`

#### Method 2: Manual Drag & Drop
1. **Build project:**
   ```bash
   npm run build
   ```

2. **Drag & Drop:**
   - Drag folder `out` ke Netlify dashboard
   - Netlify akan otomatis detect sebagai Next.js site

### 5. Database Setup

#### Cara 1: Netlify Database (Recommended)
1. Di Netlify dashboard, go to **Site settings > Functions**
2. Scroll ke "Environment variables"
3. Tambahkan:
   ```
   DATABASE_URL=file:./production.db
   ```

#### Cara 2: External Database (Optional)
1. Gunakan external database seperti PlanetScale, Supabase, atau Railway
2. Update DATABASE_URL di environment variables

### 6. API Integration

#### Cerebras API Setup:
1. Dapatkan API key dari https://console.cerebras.ai/
2. Tambahkan ke environment variables:
   ```
   CEREBRAS_API_KEY=your-actual-api-key
   ```

#### Update API Function:
Edit `netlify/functions/api/index.js` dan ganti bagian AI response:

```javascript
// Ganti bagian ini dengan actual Cerebras API call
const aiResponse = `This is a simulated response to: "${message}". In production, this would connect to Cerebras API.`;

// Menjadi:
const response = await fetch('https://api.cerebras.ai/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.CEREBRAS_API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'cerebras/llama3.1-8b',
    messages: [
      { role: 'system', content: 'You are a helpful AI assistant.' },
      { role: 'user', content: message }
    ]
  })
});

const data = await response.json();
const aiResponse = data.choices[0]?.message?.content || 'Sorry, I could not process your message.';
```

### 7. Custom Domain (Optional)

#### Setup Custom Domain:
1. Di Netlify dashboard, go to **Domain settings**
2. Tambahkan custom domain Anda
3. Configure DNS records sesuai instruksi Netlify

### 8. SSL Certificate

#### Netlify otomatis menyediakan:
- SSL certificate gratis untuk semua site
- HTTPS otomatis aktif
- Custom domain support

### 9. Testing

#### Test deployment:
1. Buka `https://your-domain.netlify.app`
2. Test semua fitur:
   - Registration
   - Login
   - Chat functionality
   - Admin panel

### 10. Monitoring

#### Netlify Features:
- **Build logs**: Monitor build process
- **Function logs**: Monitor API function errors
- **Analytics**: Traffic dan usage monitoring
- **Form submissions**: Contact form data

### 11. Troubleshooting

#### Common Issues:

**Build Errors:**
```bash
# Clean build
rm -rf .next out
npm run build
```

**Function Errors:**
- Check Netlify function logs
- Verify environment variables
- Test API endpoints individually

**Database Issues:**
- Check DATABASE_URL format
- Verify database permissions
- Test database connection

**CORS Issues:**
- CORS sudah dikonfigurasi di function
- Pastikan frontend menggunakan correct base URL

### 12. Performance Optimization

#### Netlify Optimization:
- **Edge Functions**: Automatic caching
- **Build optimization**: Minified assets
- **CDN**: Global content delivery
- **Image optimization**: Automatic image optimization

### 13. Rollback

#### Jika ada masalah:
1. Netlify otomatis menyimpan build terakhir yang berhasil
2. Kembali ke previous deployment dengan 1 click
3. Atau deploy ulang dengan perbaikan

### 14. Best Practices

#### Production Tips:
- Gunakan environment variables untuk sensitive data
- Monitor function logs secara regular
- Update dependencies secara berkala
- Test thoroughly sebelum production
- Gunakan Netlify Preview untuk testing

### 15. Support

#### Netlify Resources:
- [Documentation](https://docs.netlify.com/)
- [Community Forum](https://community.netlify.com/)
- [Support](https://www.netlify.com/support)

#### Xyonz-AI Specific:
- Pastikan Cerebras API key valid
- Monitor API usage limits
- Test chat functionality thoroughly
- Verify admin panel permissions

---

## 🎉 Selamat! Website Xyonz-AI Anda sekarang siap digunakan di Netlify!