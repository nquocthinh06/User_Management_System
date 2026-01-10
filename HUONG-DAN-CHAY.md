# 📖 HƯỚNG DẪN CHẠY DỰ ÁN - USER MANAGEMENT SYSTEM

## 🎯 Tổng quan

Dự án này có **2 cách chạy**:

1. **🐳 Docker** (Khuyên dùng - Đơn giản nhất)
2. **💻 Local Development** (Cần cài MySQL riêng)

---

## 🐳 CÁCH 1: CHẠY VỚI DOCKER (KHUYÊN DÙNG)

### ✅ Ưu điểm:
- ✅ Không cần cài MySQL riêng
- ✅ Chỉ cần 1 lệnh để chạy tất cả
- ✅ Môi trường nhất quán
- ✅ Dễ deploy

### ⚙️ Yêu cầu:
- Docker Desktop đã cài đặt
- [Download Docker Desktop](https://www.docker.com/products/docker-desktop)

### 📋 Các bước:

#### Bước 1: Khởi động Docker Desktop
```
1. Mở Docker Desktop từ Start Menu
2. Đợi icon Docker ở system tray chuyển sang màu xanh
3. Hoặc chạy: .\start-docker.ps1
```

#### Bước 2: Chạy ứng dụng
```powershell
# Chọn một trong các cách sau:

# Cách 1: Dùng batch file (Đơn giản nhất)
.\docker-start.bat

# Cách 2: Dùng docker-compose
docker-compose up --build -d

# Cách 3: Chạy và xem logs luôn
docker-compose up --build
```

#### Bước 3: Truy cập ứng dụng
Sau khi chạy thành công, mở trình duyệt:

- 🌐 **Frontend**: http://localhost:5173
- 🔌 **Backend API**: http://localhost:5000/api
- 🗄️ **MySQL**: localhost:3306

#### Bước 4: Xem logs (nếu cần)
```powershell
# Xem logs tất cả services
docker-compose logs -f

# Xem logs từng service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql

# Kiểm tra trạng thái
docker-compose ps
```

#### Bước 5: Dừng ứng dụng
```powershell
# Dừng nhưng giữ data
.\docker-stop.bat
# Hoặc:
docker-compose down

# Dừng và xóa tất cả (kể cả database)
docker-compose down -v
```

### 🔧 Scripts hỗ trợ:
| Script | Mô tả |
|--------|-------|
| `docker-start.bat` | Khởi động tất cả containers |
| `docker-stop.bat` | Dừng tất cả containers |
| `start-docker.ps1` | Tự động khởi động Docker Desktop |
| `check-docker.ps1` | Kiểm tra cấu hình Docker |

---

## 💻 CÁCH 2: CHẠY LOCAL DEVELOPMENT

### ⚠️ Yêu cầu:
- Node.js >= 18.x
- MySQL 8.0 đã cài đặt và chạy
- npm hoặc yarn

### 📋 Các bước:

#### Bước 1: Cài đặt MySQL

1. **Cài đặt MySQL**:
   - Download từ [mysql.com](https://dev.mysql.com/downloads/installer/)
   - Chọn "MySQL Installer for Windows"
   - Cài đặt MySQL Server 8.0

2. **Cấu hình MySQL**:
   - Username: `root`
   - Password: `quocthinh@1245` (hoặc password bạn muốn)
   - Port: `3306` (mặc định)

3. **Tạo database**:
   ```sql
   -- Mở MySQL Command Line hoặc MySQL Workbench
   CREATE DATABASE user_management;
   
   -- Kiểm tra database đã tạo
   SHOW DATABASES;
   ```

4. **Cập nhật cấu hình** (nếu cần):
   
   Mở file: `backend/config/database.js`
   
   ```javascript
   const dbConfig = {
       host: 'localhost',  // Thay đổi nếu cần
       port: 3306,         // Thay đổi nếu cần
       user: 'root',       // Thay đổi nếu cần
       password: 'quocthinh@1245',  // Thay đổi password của bạn
       database: 'user_management',
       // ...
   };
   ```

#### Bước 2: Cài đặt Backend

Mở **Terminal/PowerShell 1**:

```powershell
# Di chuyển vào thư mục backend
cd backend

# Cài đặt dependencies
npm install

# Chạy backend server
npm start
```

Backend sẽ chạy tại: **http://localhost:5000**

#### Bước 3: Cài đặt Frontend

Mở **Terminal/PowerShell 2** (terminal mới):

```powershell
# Di chuyển vào thư mục frontend
cd frontend

# Cài đặt dependencies
npm install

# Chạy frontend development server
npm run dev
```

Frontend sẽ chạy tại: **http://localhost:5173**

#### Bước 4: Hoặc dùng batch file tự động

Thay vì chạy 2 terminal riêng, bạn có thể dùng:

```powershell
# Chạy cả Backend và Frontend tự động
.\start.bat

# Dừng tất cả servers
.\stop.bat
```

Script này sẽ:
- Tự động cài đặt dependencies nếu chưa có
- Mở 2 cửa sổ riêng cho Backend và Frontend
- Tự động mở trình duyệt

### 📍 Ports sử dụng:
| Service | Port | URL |
|---------|------|-----|
| Frontend | 5173 | http://localhost:5173 |
| Backend | 5000 | http://localhost:5000 |
| MySQL | 3306 | localhost:3306 |

---

## 🔄 So sánh 2 cách chạy

| Tiêu chí | Docker 🐳 | Local 💻 |
|----------|-----------|----------|
| **Độ khó** | ⭐ Dễ | ⭐⭐⭐ Trung bình |
| **Cài MySQL?** | ❌ Không cần | ✅ Cần |
| **Cài Node.js?** | ❌ Không cần | ✅ Cần |
| **Số lệnh chạy** | 1 lệnh | 2-3 lệnh |
| **Port conflict** | ⚠️ Có thể | ⚠️ Có thể |
| **Phù hợp** | Mọi người | Developer |
| **Thời gian setup** | 5 phút | 15-30 phút |

---

## 🐛 Xử lý lỗi thường gặp

### ❌ Docker Issues

**Lỗi: "Docker daemon is not running"**
```
Giải pháp:
1. Mở Docker Desktop từ Start Menu
2. Hoặc chạy: .\start-docker.ps1
3. Đợi Docker khởi động hoàn tất (icon xanh)
```

**Lỗi: "Port already in use"**
```
Giải pháp:
1. Kiểm tra port đang được sử dụng:
   netstat -ano | findstr :5173
   netstat -ano | findstr :5000
   netstat -ano | findstr :3306

2. Dừng process đang dùng port hoặc thay đổi port trong docker-compose.yml
```

**Lỗi: "Cannot connect to MySQL container"**
```
Giải pháp:
1. Đợi MySQL container khởi động hoàn tất (30-60 giây)
2. Kiểm tra logs: docker-compose logs mysql
3. Kiểm tra health: docker-compose ps
```

### ❌ Local Development Issues

**Lỗi: "Cannot connect to database"**
```
Giải pháp:
1. Kiểm tra MySQL đã chạy chưa:
   - Mở Services (services.msc)
   - Tìm "MySQL80" hoặc "MySQL"
   - Đảm bảo status là "Running"

2. Kiểm tra thông tin kết nối trong backend/config/database.js

3. Kiểm tra database đã tạo chưa:
   mysql -u root -p
   SHOW DATABASES;
   USE user_management;

4. Kiểm tra firewall không chặn port 3306
```

**Lỗi: "CORS error"**
```
Giải pháp:
1. Kiểm tra backend/server.js - allowedOrigins
2. Đảm bảo frontend URL (http://localhost:5173) có trong danh sách
3. Restart backend server
```

**Lỗi: "Module not found"**
```
Giải pháp:
1. Xóa node_modules và package-lock.json
2. Chạy lại: npm install
3. Nếu vẫn lỗi: npm cache clean --force
```

---

## ✅ Checklist trước khi chạy

### Docker:
- [ ] Docker Desktop đã cài đặt
- [ ] Docker Desktop đang chạy (icon xanh)
- [ ] Ports 3306, 5000, 5173 chưa bị chiếm
- [ ] Đã chạy `.\check-docker.ps1` để kiểm tra

### Local:
- [ ] Node.js >= 18.x đã cài đặt
- [ ] MySQL đã cài đặt và chạy
- [ ] Database `user_management` đã tạo
- [ ] Đã cập nhật password trong `backend/config/database.js`
- [ ] Ports 3306, 5000, 5173 chưa bị chiếm

---

## 📚 Tài liệu tham khảo

- [README.md](README.md) - Tài liệu đầy đủ
- [QUICKSTART.md](QUICKSTART.md) - Hướng dẫn nhanh
- [Docker Documentation](https://docs.docker.com/)
- [MySQL Documentation](https://dev.mysql.com/doc/)

---

## 💡 Tips

1. **Lần đầu chạy**: Docker sẽ download images, có thể mất 5-10 phút
2. **Xem logs**: Luôn kiểm tra logs nếu có lỗi
3. **Database**: Docker tự động tạo bảng, không cần SQL script
4. **Hot reload**: Frontend và Backend đều hỗ trợ hot reload khi dev
5. **Environment variables**: Có thể dùng `.env` file cho local development

---

## 🎉 Hoàn thành!

Nếu mọi thứ chạy thành công, bạn sẽ thấy:

- ✅ Frontend: http://localhost:5173 (Giao diện đăng nhập/đăng ký)
- ✅ Backend: http://localhost:5000/api/health (Trả về JSON status)

Chúc bạn code vui vẻ! 🚀

