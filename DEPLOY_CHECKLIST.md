# ✅ Checklist Deploy Backend lên Render

## Trước Khi Deploy

- [ ] Code đã được test kỹ trên local (npm run start:dev)
- [ ] Database Neon đang hoạt động và có thể connect từ external
- [ ] File `.env` có đầy đủ config (KHÔNG push lên GitHub)
- [ ] File `.gitignore` đã exclude `.env`
- [ ] Code đã được push lên GitHub repository

## Trên Render.com

### 1. Setup Service
- [ ] Đăng ký/Login Render (https://render.com)
- [ ] Click "New +" → "Web Service"
- [ ] Connect GitHub repository
- [ ] Chọn branch `main` (hoặc branch bạn dùng)

### 2. Configure Build
- [ ] **Name**: `jwt-auth-backend` (hoặc tên bạn chọn)
- [ ] **Region**: `Singapore`
- [ ] **Root Directory**: `be` (nếu backend trong subfolder)
- [ ] **Runtime**: `Node`
- [ ] **Build Command**: `npm install && npm run build`
- [ ] **Start Command**: `npm run start:prod`
- [ ] **Instance Type**: `Free`

### 3. Environment Variables (Click "Advanced")
Copy các giá trị từ file `.env` local của bạn:

```
NODE_ENV = production
PORT = 3000
DB_HOST = [Your Neon DB Host]
DB_PORT = 5432
DB_USERNAME = [Your DB Username]
DB_PASSWORD = [Your DB Password]
DB_DATABASE = [Your DB Name]
JWT_ACCESS_SECRET = [Your Secret - đổi mới cho production]
JWT_REFRESH_SECRET = [Your Secret - đổi mới cho production]
JWT_ACCESS_EXPIRATION = 15m
JWT_REFRESH_EXPIRATION = 7d
FRONTEND_URL = http://localhost:5173
```

### 4. Deploy
- [ ] Click "Create Web Service"
- [ ] Đợi build & deploy (3-5 phút)
- [ ] Check logs để xem có lỗi không

## Sau Khi Deploy

### Verify Deployment
- [ ] Service status = "Live" (màu xanh)
- [ ] Copy URL (vd: `https://jwt-auth-backend.onrender.com`)
- [ ] Test endpoint: `GET https://your-url.onrender.com/auth/me` 
  - Expect: 401 Unauthorized (correct, no token)

### Test API với Thunder Client/Postman
- [ ] POST `/auth/register` - Register user mới
- [ ] POST `/auth/login` - Login với user vừa tạo
- [ ] GET `/auth/me` - Get profile với token
- [ ] POST `/auth/refresh` - Refresh token
- [ ] POST `/auth/logout` - Logout

### Cập Nhật Documentation
- [ ] Copy backend URL
- [ ] Note lại thông tin service (name, region, URL)
- [ ] Sẵn sàng cho bước tiếp theo: Deploy Frontend

## 🎯 Next: Deploy Frontend

Sau khi backend chạy ổn định:
1. Deploy frontend lên Netlify/Vercel
2. Set `VITE_API_URL` = backend URL
3. Update `FRONTEND_URL` trong Render backend = frontend URL
4. Test toàn bộ authentication flow

---

**Backend URL sẽ có dạng:**
```
https://jwt-auth-backend.onrender.com
```

**Lưu URL này để config cho frontend!**
