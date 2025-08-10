# Supabase Integration Setup Guide

## 🚀 Complete Supabase Setup for Saanvi's Mural

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create `.env.local` with your Supabase credentials:
```bash
# Database (PostgreSQL) - Supabase provides this
POSTGRES_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# Supabase Client
NEXT_PUBLIC_SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[YOUR-ANON-KEY]"
```

### 3. Supabase Project Setup

#### A. Create Storage Bucket
1. Go to Storage in your Supabase dashboard
2. Create a new bucket called `mural-images`
3. Set it to **Public** (so images can be viewed)
4. Enable Row Level Security (RLS) but create a policy for public read access

#### B. Storage Policy (Public Read Access)
```sql
-- Allow public read access to images
CREATE POLICY "Public read access" ON storage.objects
FOR SELECT USING (bucket_id = 'mural-images');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'mural-images' 
  AND auth.role() = 'authenticated'
);

-- Allow users to delete own uploads
CREATE POLICY "Users can delete own uploads" ON storage.objects
FOR DELETE USING (
  bucket_id = 'mural-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

### 4. Database Setup
```bash
# Generate Prisma client
npm run db:generate

# Push schema to Supabase PostgreSQL
npm run db:push
```

### 5. Test the System
1. Start dev server: `npm run dev`
2. Visit: `http://localhost:3000/admin`
3. Upload a test image
4. Check the main mural: `http://localhost:3000`

## 📊 Freemium Limits & Optimization

### Storage Limits
- **Total Storage**: 1GB (free tier)
- **Individual Files**: 50MB max
- **Estimated Capacity**: ~500 images (2MB average)

### Cost Optimization
- **Image Compression**: Consider using WebP format
- **Smart Cropping**: Upload appropriately sized images
- **Cleanup**: Regular deletion of unused images

### Performance Tips
- Images are served via Supabase CDN
- Automatic caching for fast loading
- Responsive image sizing with Next.js Image component

## 🔧 Advanced Features

### Image Optimization (Future Enhancement)
```bash
npm install sharp
```
- Automatic image compression
- Multiple size generation
- WebP conversion

### Authentication (Optional)
- Add user login for admin panel
- Restrict uploads to authenticated users
- Track who uploaded what

## 🚨 Troubleshooting

### Common Issues

1. **"Bucket not found"**
   - Ensure bucket name is exactly `mural-images`
   - Check bucket is set to public

2. **"Permission denied"**
   - Verify storage policies are set correctly
   - Check RLS is enabled with proper policies

3. **"Database connection failed"**
   - Verify POSTGRES_URL format
   - Check Supabase project is active

4. **"File too large"**
   - Check file size is under 50MB
   - Consider compressing images before upload

### Debug Commands
```bash
# Check Prisma connection
npm run db:studio

# View database logs
# Check Supabase dashboard > Logs
```

## 📈 Scaling Beyond 500 Images

When you approach the 1GB limit:

1. **Upgrade Plan**: Supabase Pro ($25/month) gives you 100GB
2. **External CDN**: Use Cloudinary or AWS S3 for images
3. **Hybrid Approach**: Keep metadata in Supabase, images elsewhere

## 🎯 Production Deployment

1. **Vercel**: Automatic deployment with environment variables
2. **Domain**: Add custom domain in Vercel
3. **SSL**: Automatic HTTPS via Vercel
4. **Monitoring**: Check Supabase dashboard for usage

---

**Your mural is now production-ready and can scale to 500+ images! 🎉** 