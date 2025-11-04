# 🚀 Hướng Dẫn Deploy Backend lên Render

## 📋 Chuẩn Bị

### 1. Đảm bảo code đã được push lên GitHub
```powershell
# Di chuyển vào thư mục be
cd "d:\Nam_4\Advanced Web\IA04\be"

# Khởi tạo git (nếu chưa có)
git init

# Add tất cả files (trừ .env vì đã có trong .gitignore)
git add .

# Commit
git commit -m "Prepare backend for Render deployment"

# Add remote repository (thay YOUR_USERNAME và YOUR_REPO)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Push lên GitHub
git push -u origin main
```

## 🌐 Deploy trên Render

### Bước 1: Tạo Account và Web Service

1. Truy cập: https://render.com
2. Đăng ký/Đăng nhập (có thể dùng GitHub để login nhanh)
3. Click **"New +"** → Chọn **"Web Service"**

### Bước 2: Connect Repository

1. **Connect GitHub**: Click "Connect account" để kết nối GitHub
2. **Chọn Repository**: Tìm và chọn repository chứa backend của bạn
3. Click **"Connect"**

### Bước 3: Cấu Hình Web Service

Điền các thông tin sau:

#### Basic Settings:
- **Name**: `jwt-auth-backend` (hoặc tên bạn muốn)
- **Region**: `Singapore` (gần Việt Nam nhất)
- **Branch**: `main` (hoặc branch bạn đang dùng)
- **Root Directory**: `be` (nếu backend nằm trong subfolder) hoặc để trống nếu repo chỉ có backend
- **Runtime**: `Node`
- **Build Command**: 
  ```
  npm install && npm run build
  ```
- **Start Command**: 
  ```
  npm run start:prod
  ```

#### Instance Type:
- Chọn **"Free"** (miễn phí nhưng sẽ sleep sau 15 phút không dùng)

### Bước 4: Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Thêm các biến sau (copy từ file `.env` của bạn):

```
NODE_ENV = production

PORT = 3000

DB_HOST = ep-blue-mouse-a177q7bf-pooler.ap-southeast-1.aws.neon.tech

DB_PORT = 5432

DB_USERNAME = neondb_owner

DB_PASSWORD = npg_QhPvz8xKr4cX

DB_DATABASE = neondb

JWT_ACCESS_SECRET = super-secret-access-key-change-in-production-abc123xyz

JWT_REFRESH_SECRET = super-secret-refresh-key-change-in-production-xyz789def

JWT_ACCESS_EXPIRATION = 15m

JWT_REFRESH_EXPIRATION = 7d

FRONTEND_URL = http://localhost:5173
```

**⚠️ Lưu ý**: 
- `FRONTEND_URL` sẽ được update sau khi deploy frontend
- Nên đổi JWT secrets thành giá trị mới an toàn hơn cho production

### Bước 5: Deploy

1. Click **"Create Web Service"**
2. Render sẽ bắt đầu build và deploy (khoảng 3-5 phút)
3. Theo dõi logs để xem quá trình deploy

### Bước 6: Kiểm Tra Deployment

Sau khi deploy thành công:

1. Render sẽ cung cấp URL dạng: `https://jwt-auth-backend.onrender.com`
2. Test API bằng cách truy cập: `https://jwt-auth-backend.onrender.com/auth/me`
   - Sẽ nhận 401 Unauthorized (đúng vì chưa có token)
3. Test health check endpoint (nếu có): `https://your-app.onrender.com`

## ✅ Sau Khi Deploy Thành Công

### 1. Lưu URL Backend
Copy URL của backend (VD: `https://jwt-auth-backend.onrender.com`)

### 2. Update CORS Settings (nếu cần)
Sau khi deploy frontend, quay lại Render và update:
```
FRONTEND_URL = https://your-frontend.netlify.app
```
Hoặc cho phép multiple origins bằng cách update code trong `main.ts`:
```typescript
app.enableCors({
  origin: [
    'http://localhost:5173',
    'https://your-frontend.netlify.app'
  ],
  // ...
});
```

### 3. Test API với Postman/Thunder Client

**Register:**
```bash
POST https://jwt-auth-backend.onrender.com/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123",
  "name": "Test User"
}
```

**Login:**
```bash
POST https://jwt-auth-backend.onrender.com/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

## 🔧 Troubleshooting

### Lỗi Build Failed
- Check logs trong Render Dashboard
- Đảm bảo `package.json` có đầy đủ dependencies
- Verify `build` script: `"build": "nest build"`

### Lỗi Start Failed
- Check start command: `npm run start:prod`
- Verify có file `dist/main.js` sau khi build
- Check logs xem có lỗi runtime không

### Lỗi Database Connection
- Verify các biến DB_HOST, DB_USERNAME, DB_PASSWORD đúng
- Check Neon database có allow external connections không
- Test connection string với tool như DBeaver

### Lỗi CORS
- Update FRONTEND_URL với URL của frontend
- Restart service sau khi thay đổi env vars

### Service Sleep (Free Tier)
- Free tier của Render sẽ sleep sau 15 phút không dùng
- Request đầu tiên sau khi sleep sẽ mất 30-60s để wake up
- Upgrade lên Paid plan ($7/tháng) để tránh sleep

## 📝 Các Lệnh Hữu Ích

### Xem Logs Realtime
```bash
# Trong Render Dashboard
- Vào Web Service → Logs tab
- Hoặc dùng Render CLI (cần cài đặt)
```

### Redeploy Manual
```bash
# Trong Render Dashboard
- Vào Web Service
- Click "Manual Deploy" → "Deploy latest commit"
```

### Update Environment Variables
```bash
# Trong Render Dashboard
- Vào Web Service
- Tab "Environment"
- Add/Edit variables
- Service sẽ tự động restart
```

## 🎯 Next Steps

Sau khi backend deploy xong:

1. ✅ Copy URL backend
2. ⏭️ Deploy frontend lên Netlify/Vercel
3. ⏭️ Update `VITE_API_URL` trong frontend với URL backend
4. ⏭️ Update `FRONTEND_URL` trong backend với URL frontend
5. ✅ Test toàn bộ flow authentication

---

**Render Free Tier Limits:**
- ✅ Miễn phí hoàn toàn
- ⚠️ Service sleep sau 15 phút không dùng
- ⚠️ 750 giờ/tháng (đủ cho 1 tháng 24/7)
- ⚠️ Shared CPU và RAM
- ✅ Đủ cho assignment/demo project
