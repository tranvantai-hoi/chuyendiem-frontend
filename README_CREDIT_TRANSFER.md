# Hệ thống Chuyển điểm Đại học

Hệ thống quản lý chuyển điểm đại học với backend Node.js/Express/PostgreSQL và frontend React + Vite + React Query.

## Cấu trúc dự án

```
├── backend/                 # Backend API
│   ├── config/             # Database configuration
│   ├── controllers/        # Route controllers
│   ├── database/           # Database schema
│   ├── middleware/         # Auth middleware
│   ├── routes/             # API routes
│   ├── services/           # Business logic services
│   ├── utils/              # Utilities (Excel processing)
│   └── server.js           # Express server entry point
│
└── src/                    # Frontend React app
    ├── components/
    │   └── CreditTransfer/ # Components for credit transfer system
    ├── pages/
    │   └── CreditTransfer/ # Pages for credit transfer system
    └── services/
        └── creditTransferApi.js  # API client
```

## Cài đặt Backend

### 1. Yêu cầu
- Node.js >= 18
- PostgreSQL >= 12

### 2. Thiết lập Database

```bash
# Tạo database
createdb credit_transfer_db

# Chạy schema SQL
psql -d credit_transfer_db -f backend/database/schema.sql
```

### 3. Cài đặt dependencies

```bash
cd backend
npm install
```

### 4. Cấu hình môi trường

Tạo file `backend/.env` từ `backend/.env.example`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=credit_transfer_db
DB_USER=postgres
DB_PASSWORD=postgres

PORT=3000
NODE_ENV=development

JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
```

### 5. Chạy backend

```bash
# Development mode
npm run dev

# Production mode
npm start
```

Backend sẽ chạy tại `http://localhost:3000`

## Cài đặt Frontend

### 1. Cài đặt dependencies

```bash
# Từ thư mục gốc
npm install
```

### 2. Cấu hình môi trường

Tạo file `.env` từ `env.example`:

```env
VITE_API_URL=http://localhost:3000/api
```

### 3. Chạy frontend

```bash
npm run dev
```

Frontend sẽ chạy tại `http://localhost:5173`

## Database Schema

### Các bảng chính:

1. **khoa** - Quản lý các khoa
2. **chuong_trinh** - Chương trình đào tạo
3. **hoc_phan** - Học phần
4. **chuong_trinh_hoc_phan** - Quan hệ chương trình - học phần
5. **lop** - Lớp học
6. **sinh_vien** - Sinh viên
7. **dot_xet** - Đợt xét chuyển điểm
8. **chuyen_diem_chi_tiet** - Chi tiết chuyển điểm (với validation)
9. **users** - Người dùng hệ thống

### Validation trong chuyen_diem_chi_tiet:

- `kiem_tra_hoc_phan`: Kiểm tra học phần có thuộc chương trình không
- `loi_sai_ten_hoc_phan`: Ghi nhận lỗi sai tên học phần
- `loi_sai_so_tin_chi`: Ghi nhận lỗi sai số tín chỉ
- `thong_bao_loi`: Mô tả chi tiết các lỗi

## API Endpoints

### Authentication
- `POST /api/auth/login` - Đăng nhập

### Khoa
- `GET /api/khoa` - Lấy danh sách
- `GET /api/khoa/:id` - Lấy chi tiết
- `POST /api/khoa` - Tạo mới (Staff/Admin)
- `PUT /api/khoa/:id` - Cập nhật (Staff/Admin)
- `DELETE /api/khoa/:id` - Xóa (Admin)

### Chương trình, Học phần, Lớp, Sinh viên, Đợt xét
Tương tự với prefix: `/api/chuong-trinh`, `/api/hoc-phan`, `/api/lop`, `/api/sinh-vien`, `/api/dot-xet`

### Chuyển điểm
- `GET /api/chuyen-diem` - Lấy tất cả
- `GET /api/chuyen-diem/dot-xet/:dotXetId` - Lấy theo đợt xét
- `POST /api/chuyen-diem` - Tạo mới (tự động validate)
- `PUT /api/chuyen-diem/:id` - Cập nhật (tự động validate)

### Import/Export
- `POST /api/import/sinh-vien` - Import sinh viên từ Excel
- `POST /api/import/hoc-phan` - Import học phần từ Excel
- `POST /api/import/chuyen-diem` - Import chuyển điểm từ Excel
- `GET /api/export/chuyen-diem/dot-xet/:dotXetId` - Export Excel

## Tính năng chính

### 1. Quản lý dữ liệu cơ bản
- CRUD đầy đủ cho Khoa, Chương trình, Học phần, Lớp, Sinh viên, Đợt xét
- Giao diện quản lý trực quan với bảng dữ liệu và modal form

### 2. Import/Export Excel
- Import sinh viên, học phần, chuyển điểm từ Excel (theo chunk)
- Export danh sách chuyển điểm theo đợt xét ra Excel
- Xử lý lỗi và báo cáo kết quả import

### 3. Validation chuyển điểm
- Tự động kiểm tra học phần chuyển có thuộc chương trình của sinh viên
- Phát hiện lỗi sai tên học phần
- Phát hiện lỗi sai số tín chỉ
- Highlight các dòng có lỗi trên giao diện

### 4. Giao diện người dùng
- Dashboard tổng quan
- Bảng dữ liệu với tìm kiếm
- Modal form cho CRUD
- Màn hình chi tiết chuyển điểm với highlight lỗi
- Export Excel trực tiếp từ giao diện

## Tạo user mặc định

Sau khi setup database, tạo user admin mặc định:

```sql
INSERT INTO users (username, password_hash, ho_ten, vai_tro) 
VALUES ('admin', '$2a$10$YourHashedPassword', 'Administrator', 'admin');
```

Hoặc sử dụng bcrypt để hash password:

```javascript
// Trong Node.js
const bcrypt = require('bcryptjs');
const hash = bcrypt.hashSync('admin123', 10);
console.log(hash);
```

## Cấu trúc Frontend

### Pages
- `/credit-transfer/login` - Đăng nhập
- `/credit-transfer/dashboard` - Dashboard
- `/credit-transfer/khoa` - Quản lý khoa
- `/credit-transfer/chuong-trinh` - Quản lý chương trình
- `/credit-transfer/hoc-phan` - Quản lý học phần
- `/credit-transfer/lop` - Quản lý lớp
- `/credit-transfer/sinh-vien` - Quản lý sinh viên
- `/credit-transfer/dot-xet` - Quản lý đợt xét
- `/credit-transfer/chuyen-diem/:dotXetId` - Chi tiết chuyển điểm
- `/credit-transfer/import` - Import Excel

## Ghi chú

- Tất cả API cần authentication (trừ login)
- Staff và Admin có quyền CRUD
- User thường chỉ xem
- Validation tự động khi tạo/cập nhật chuyển điểm
- Import Excel xử lý theo chunk để tối ưu hiệu năng

