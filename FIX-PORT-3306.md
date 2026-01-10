# 🔧 Hướng dẫn sửa lỗi Port 3306 đã được sử dụng

## ❌ Lỗi gặp phải

```
Error: ports are not available: exposing port TCP 0.0.0.0:3306 -> 127.0.0.1:0: 
listen tcp 0.0.0.0:3306: bind: Only one usage of each socket address 
(protocol/network address/port) is normally permitted.
```

**Nguyên nhân**: MySQL Server đang chạy trên máy local và đã chiếm port 3306.

---

## ✅ Giải pháp

### **Giải pháp 1: Dừng MySQL Local (Khuyên dùng)** ⭐

Đơn giản nhất nếu bạn không cần MySQL local cho project khác.

#### Cách 1: Dùng PowerShell Script (Tự động)

1. **Mở PowerShell as Administrator**:
   - Right-click PowerShell → Run as Administrator

2. **Chạy script**:
   ```powershell
   cd E:\user-management-system-fullstack
   .\stop-mysql-local.ps1
   ```

3. **Kiểm tra port đã giải phóng**:
   ```powershell
   .\fix-port-conflict.ps1
   ```

4. **Chạy Docker**:
   ```powershell
   .\docker-start.bat
   ```

#### Cách 2: Dừng thủ công qua Services

1. **Mở Services**:
   - Press `Win + R`
   - Type: `services.msc`
   - Press Enter

2. **Tìm MySQL Service**:
   - Tìm service có tên: `MySQL80` hoặc `MySQL`
   - Right-click → Stop

3. **Hoặc dùng Command Line** (PowerShell as Admin):
   ```powershell
   # Tìm MySQL service
   Get-Service | Where-Object {$_.Name -like "*mysql*"}
   
   # Dừng service (thay MySQL80 bằng tên service của bạn)
   Stop-Service -Name MySQL80 -Force
   ```

4. **Hoặc dừng process trực tiếp**:
   ```powershell
   # Tìm process
   Get-Process -Name mysqld
   
   # Dừng process (thay PID bằng process ID thực tế)
   Stop-Process -Id <PID> -Force
   ```

#### Khởi động lại MySQL local sau này (nếu cần):

```powershell
# Qua Services
net start MySQL80

# Hoặc mở Services.msc và Start service
```

---

### **Giải pháp 2: Dùng Port Khác cho Docker MySQL** 🔄

Nếu bạn cần giữ MySQL local chạy, có thể đổi port MySQL container sang 3307.

#### Cách 1: Dùng docker-compose.alt.yml

File `docker-compose.alt.yml` đã được cấu hình sẵn để dùng port 3307:

```powershell
# Chạy với port 3307
docker-compose -f docker-compose.alt.yml up --build -d

# Xem logs
docker-compose -f docker-compose.alt.yml logs -f

# Dừng
docker-compose -f docker-compose.alt.yml down
```

**Lưu ý**: 
- MySQL container vẫn dùng port 3306 bên trong
- Chỉ port host được đổi thành 3307
- Backend vẫn kết nối MySQL qua internal network (không đổi)

#### Cách 2: Set Environment Variable

1. **Tạo file `.env`** trong thư mục gốc:
   ```env
   MYSQL_PORT=3307
   ```

2. **Chạy Docker Compose**:
   ```powershell
   docker-compose up --build -d
   ```

3. **Hoặc set trực tiếp trong PowerShell**:
   ```powershell
   $env:MYSQL_PORT=3307
   docker-compose up --build -d
   ```

#### Cách 3: Sửa trực tiếp docker-compose.yml

Sửa dòng 13 trong `docker-compose.yml`:
```yaml
ports:
  - "3307:3306"  # Đổi từ "3306:3306"
```

---

## 🔍 Kiểm tra Port Conflict

### Kiểm tra port nào đang được sử dụng:

```powershell
# Kiểm tra port 3306
netstat -ano | findstr :3306

# Hoặc dùng PowerShell
Get-NetTCPConnection -LocalPort 3306

# Kiểm tra tất cả ports cần thiết
.\fix-port-conflict.ps1
```

### Tìm process đang dùng port:

```powershell
# Lấy Process ID từ kết quả netstat
# Sau đó xem process name:
Get-Process -Id <PID>

# Hoặc xem chi tiết:
tasklist /FI "PID eq <PID>"
```

---

## 📋 Checklist

- [ ] Đã kiểm tra port 3306 đang được sử dụng bởi process nào
- [ ] Quyết định: Dừng MySQL local hay dùng port khác
- [ ] Đã dừng MySQL local (nếu chọn giải pháp 1)
- [ ] Hoặc đã cấu hình port khác (nếu chọn giải pháp 2)
- [ ] Đã kiểm tra lại port đã giải phóng: `.\fix-port-conflict.ps1`
- [ ] Chạy lại Docker: `.\docker-start.bat`

---

## 🚀 Sau khi sửa

Sau khi đã giải quyết port conflict, chạy:

```powershell
# Kiểm tra lại
.\fix-port-conflict.ps1

# Chạy Docker
.\docker-start.bat

# Hoặc với port khác
docker-compose -f docker-compose.alt.yml up --build -d
```

---

## 💡 Tips

1. **Nếu thường xuyên cần cả MySQL local và Docker**:
   - Nên cấu hình MySQL Docker dùng port 3307
   - Hoặc đổi MySQL local sang port khác

2. **Để tránh conflict về sau**:
   - Luôn chạy `.\fix-port-conflict.ps1` trước khi start Docker
   - Hoặc dùng `docker-compose.alt.yml` với port 3307

3. **Kiểm tra nhanh**:
   ```powershell
   # Xem tất cả ports đang dùng
   netstat -ano | findstr "3306 5000 5173"
   ```

---

## ❓ Vẫn gặp lỗi?

1. **Restart Docker Desktop**:
   - Right-click Docker icon → Restart

2. **Kiểm tra containers cũ**:
   ```powershell
   docker ps -a
   docker-compose down
   ```

3. **Xem logs chi tiết**:
   ```powershell
   docker-compose logs mysql
   ```

4. **Kiểm tra firewall**:
   - Đảm bảo Windows Firewall không chặn port 3306

