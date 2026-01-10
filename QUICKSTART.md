# 🚀 Hướng dẫn nhanh - Quick Start Guide

## Chạy nhanh với Docker (Khuyên dùng)

### ⚡ Chỉ cần 3 bước:

1. **Khởi động Docker Desktop**
   - Mở Docker Desktop từ Start Menu
   - Đợi icon Docker chuyển sang màu xanh (đã chạy)

2. **Chạy ứng dụng**
   ```powershell
   .\docker-start.bat
   ```
   Hoặc:
   ```powershell
   docker-compose up --build -d
   ```

3. **Truy cập ứng dụng**
   - Mở trình duyệt: http://localhost:5173
   - Backend API: http://localhost:5000

### 🛑 Dừng ứng dụng:
```powershell
.\docker-stop.bat
```
Hoặc:
```powershell
docker-compose down
```

---

## Chạy Local Development

### ⚡ 4 bước:

1. **Cài đặt MySQL và tạo database**
   ```sql
   CREATE DATABASE user_management;
   ```

2. **Chạy Backend** (Terminal 1)
   ```powershell
   cd backend
   npm install
   npm start
   ```

3. **Chạy Frontend** (Terminal 2)
   ```powershell
   cd frontend
   npm install
   npm run dev
   ```

4. **Hoặc dùng batch file tự động**
   ```powershell
   .\start.bat
   ```

### 🛑 Dừng:
```powershell
.\stop.bat
```

---

## 📊 So sánh 2 cách chạy

| Tính năng | Docker | Local |
|-----------|--------|-------|
| **Độ khó** | ⭐ Dễ | ⭐⭐⭐ Khó hơn |
| **Cần cài MySQL?** | ❌ Không | ✅ Có |
| **Port conflict?** | ⚠️ Có thể | ⚠️ Có thể |
| **Khởi động** | 1 lệnh | 2-3 lệnh |
| **Phù hợp** | Production/Dev | Development |

---

## ❓ Gặp lỗi?

### Docker không chạy?
```powershell
.\start-docker.ps1
```

### Kiểm tra cấu hình Docker?
```powershell
.\check-docker.ps1
```

### Xem logs?
```powershell
docker-compose logs -f
```

### Xem chi tiết trong README.md

