# User Management System - Full Stack

Hệ thống quản lý người dùng hoàn chỉnh với Frontend React, Backend Express.js và MySQL Database.

## 🚀 Tính năng

- ✅ Đăng ký tài khoản
- ✅ Đăng nhập với JWT authentication
- ✅ Xem và chỉnh sửa profile
- ✅ Đổi mật khẩu
- ✅ Xóa tài khoản
- ✅ Danh sách người dùng
- ✅ Giao diện hiện đại với dark theme
- ✅ Responsive design

## 📁 Cấu trúc thư mục

```
user-management-system-fullstack/
├── backend/              # Express.js Backend API
│   ├── config/          # Database configuration
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Authentication middleware
│   ├── models/          # Data models
│   ├── routes/          # API routes
│   ├── Dockerfile       # Backend Docker image
│   └── server.js        # Entry point
│
├── frontend/            # React Frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   └── context/     # React Context
│   ├── Dockerfile       # Frontend Docker image
│   └── vite.config.js   # Vite configuration
│
├── docker-compose.yml   # Docker Compose configuration
├── start.bat            # Chạy local development
├── stop.bat             # Dừng local development
├── docker-start.bat     # Chạy với Docker
├── docker-stop.bat      # Dừng Docker containers
└── README.md
```

## 🛠️ Cách chạy dự án

Có **2 cách** để chạy dự án này:

### **Cách 1: Chạy với Docker (Khuyên dùng)** 🐳

Cách này đơn giản nhất, tất cả services (MySQL, Backend, Frontend) sẽ chạy trong Docker containers.

#### Yêu cầu:
- Docker Desktop đã cài đặt và đang chạy
- [Download Docker Desktop](https://www.docker.com/products/docker-desktop)

#### Các bước:

**Bước 1: Khởi động Docker Desktop**
```powershell
# Kiểm tra Docker đã chạy chưa
docker info

# Nếu chưa chạy, mở Docker Desktop từ Start Menu
# Hoặc chạy script tự động:
.\start-docker.ps1
```

**Bước 2: Chạy tất cả services**
```powershell
# Cách 1: Dùng batch file (Windows)
.\docker-start.bat

# Cách 2: Dùng docker-compose trực tiếp
docker-compose up --build -d
```

**Bước 3: Truy cập ứng dụng**
- 🌐 **Frontend**: http://localhost:5173
- 🔌 **Backend API**: http://localhost:5000
- 🗄️ **MySQL**: localhost:3306

**Bước 4: Xem logs (nếu cần)**
```powershell
# Xem logs tất cả services
docker-compose logs -f

# Xem logs một service cụ thể
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql

# Kiểm tra status
docker-compose ps
```

**Bước 5: Dừng services**
```powershell
# Cách 1: Dùng batch file
.\docker-stop.bat

# Cách 2: Dùng docker-compose
docker-compose down

# Dừng và xóa volumes (xóa database)
docker-compose down -v
```

#### Scripts hỗ trợ:
- `check-docker.ps1` - Kiểm tra cấu hình Docker
- `start-docker.ps1` - Tự động khởi động Docker Desktop
- `docker-start.bat` - Khởi động tất cả containers
- `docker-stop.bat` - Dừng tất cả containers

---

### **Cách 2: Chạy Local Development (Manual)** 💻

Chạy từng service riêng lẻ trên máy local, cần cài đặt MySQL riêng.

#### Yêu cầu:
- Node.js >= 18.x
- MySQL 8.0 đã cài đặt và chạy
- npm hoặc yarn

#### Các bước:

**Bước 1: Cài đặt và cấu hình MySQL**

1. Cài đặt MySQL từ [mysql.com](https://dev.mysql.com/downloads/installer/)
2. Tạo database:
```sql
CREATE DATABASE user_management;
```

3. Cập nhật thông tin kết nối trong `backend/config/database.js` nếu cần:
```javascript
host: 'localhost',
port: 3306,
user: 'root',
password: 'your_password',
database: 'user_management'
```

**Bước 2: Cài đặt Backend**

```bash
cd backend
npm install
npm start
# Hoặc: node server.js
```

Backend sẽ chạy tại: http://localhost:5000

**Bước 3: Cài đặt Frontend** (mở terminal mới)

```bash
cd frontend
npm install
npm run dev
```

Frontend sẽ chạy tại: http://localhost:5173

**Bước 4: Hoặc dùng batch file để chạy cả 2**

```powershell
# Chạy cả Backend và Frontend tự động
.\start.bat

# Dừng tất cả servers
.\stop.bat
```

#### Ports sử dụng:
- **Frontend**: 5173
- **Backend**: 5000
- **MySQL**: 3306

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| POST | `/api/auth/register` | Đăng ký tài khoản | ❌ |
| POST | `/api/auth/login` | Đăng nhập | ❌ |

### User Management
| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/api/users/profile` | Lấy thông tin profile | ✅ |
| PUT | `/api/users/profile` | Cập nhật profile | ✅ |
| PUT | `/api/users/password` | Đổi mật khẩu | ✅ |
| DELETE | `/api/users/profile` | Xóa tài khoản | ✅ |
| GET | `/api/users` | Danh sách tất cả users | ✅ |

### Health Check
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/health` | Kiểm tra server status |

### Request Headers (cho protected routes)
```
Authorization: Bearer <JWT_TOKEN>
```

### Response Format
```json
{
  "success": true,
  "message": "Success message",
  "data": { ... }
}
```

---

## 🔐 Bảo mật

- ✅ Mật khẩu được hash bằng bcrypt (10 rounds)
- ✅ JWT token với thời hạn 7 ngày
- ✅ Protected routes yêu cầu token hợp lệ
- ✅ CORS configuration cho phép requests từ frontend
- ✅ Input validation với express-validator
- ✅ Non-root users trong Docker containers

---

## 🐳 Docker Configuration

### Services trong docker-compose.yml:

1. **MySQL** (mysql)
   - Image: mysql:8.0
   - Port: 3306
   - Database: user_management
   - Volume: mysql_data (persistent data)

2. **Backend** (backend)
   - Build: ./backend
   - Port: 5000
   - Depends on: MySQL
   - Environment variables: DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME

3. **Frontend** (frontend)
   - Build: ./frontend
   - Port: 5173
   - Depends on: Backend
   - Proxy: /api → http://backend:5000

### Networks:
- `app-network`: Bridge network cho tất cả services

### Volumes:
- `mysql_data`: Persistent storage cho MySQL database

---

## 🛠️ Development

### Backend Development

```bash
cd backend
npm install
npm start
```

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

### Build Frontend for Production

```bash
cd frontend
npm run build
```

---

## 🐛 Troubleshooting

### Docker Issues

**Lỗi: "Docker daemon is not running"**
- Giải pháp: Khởi động Docker Desktop từ Start Menu
- Hoặc chạy: `.\start-docker.ps1`

**Lỗi: "Port already in use"**
- Giải pháp: Dừng process đang dùng port hoặc thay đổi port trong docker-compose.yml

**Lỗi: "Cannot connect to MySQL"**
- Giải pháp: Đợi MySQL container khởi động hoàn tất (khoảng 30-60 giây)
- Kiểm tra logs: `docker-compose logs mysql`

### Local Development Issues

**Lỗi: "Cannot connect to database"**
- Kiểm tra MySQL đã chạy chưa
- Kiểm tra thông tin kết nối trong `backend/config/database.js`
- Đảm bảo database `user_management` đã được tạo

**Lỗi: "CORS error"**
- Kiểm tra backend CORS configuration trong `backend/server.js`
- Đảm bảo frontend URL được thêm vào allowedOrigins

---

## 📝 Environment Variables

### Backend (.env hoặc docker-compose.yml)
```
DB_HOST=mysql (hoặc localhost cho local)
DB_PORT=3306
DB_USER=root
DB_PASSWORD=quocthinh@1245
DB_NAME=user_management
NODE_ENV=production
PORT=5000
```

### Frontend (docker-compose.yml)
```
VITE_API_URL=http://backend:5000 (chỉ cho Docker)
```

---

## 📦 Dependencies

### Backend
- express: Web framework
- mysql2: MySQL client
- bcryptjs: Password hashing
- jsonwebtoken: JWT authentication
- cors: CORS middleware
- express-validator: Input validation

### Frontend
- react: UI library
- react-router-dom: Routing
- axios: HTTP client
- vite: Build tool

---

## 📄 License

MIT

---

## 🤝 Contributing

Mọi đóng góp đều được chào đón! Vui lòng tạo issue hoặc pull request.
