# Tài Liệu API (API Documentation)

## API Người Dùng (User APIs)

### 1. Đăng Ký Người Dùng (User Registration)

**Tiếng Việt:**
- **Endpoint:** `POST /api/users/register`
- **Mô tả:** Đăng ký tài khoản người dùng mới
- **Yêu cầu xác thực:** Không
- **Body:**
  ```json
  {
    "name": "Tên Người Dùng",
    "email": "email@example.com",
    "password": "mật_khẩu",
    "type": "user" // Tùy chọn, mặc định là "user"
  }
  ```
- **Phản hồi thành công (201):**
  ```json
  {
    "message": "User registered successfully",
    "user": {
      "id": "user_id",
      "name": "Tên Người Dùng",
      "username": "email@example.com",
      "email": "email@example.com",
      "type": "user",
      "isActive": true
    }
  }
  ```

**English:**
- **Endpoint:** `POST /api/users/register`
- **Description:** Register a new user account
- **Authentication required:** No
- **Body:**
  ```json
  {
    "name": "User Name",
    "email": "email@example.com",
    "password": "password",
    "type": "user" // Optional, default is "user"
  }
  ```
- **Success response (201):**
  ```json
  {
    "message": "User registered successfully",
    "user": {
      "id": "user_id",
      "name": "User Name",
      "username": "email@example.com",
      "email": "email@example.com",
      "type": "user",
      "isActive": true
    }
  }
  ```

### 2. Đăng Nhập (Login)

**Tiếng Việt:**
- **Endpoint:** `POST /api/users/login`
- **Mô tả:** Đăng nhập với email và mật khẩu
- **Yêu cầu xác thực:** Không
- **Body:**
  ```json
  {
    "email": "email@example.com",
    "password": "mật_khẩu"
  }
  ```
- **Phản hồi thành công (200):**
  ```json
  {
    "message": "Login successful",
    "token": "jwt_token"
  }
  ```

**English:**
- **Endpoint:** `POST /api/users/login`
- **Description:** Login with email and password
- **Authentication required:** No
- **Body:**
  ```json
  {
    "email": "email@example.com",
    "password": "password"
  }
  ```
- **Success response (200):**
  ```json
  {
    "message": "Login successful",
    "token": "jwt_token"
  }
  ```

### 3. Đăng Nhập Qua Firebase (Firebase Login)

**Tiếng Việt:**
- **Endpoint:** `POST /api/users/login-firebase`
- **Mô tả:** Đăng nhập thông qua Firebase Authentication
- **Yêu cầu xác thực:** Không
- **Body:**
  ```json
  {
    "email": "email@example.com"
  }
  ```
- **Phản hồi thành công (200):**
  ```json
  {
    "message": "Login successful",
    "token": "jwt_token"
  }
  ```

**English:**
- **Endpoint:** `POST /api/users/login-firebase`
- **Description:** Login through Firebase Authentication
- **Authentication required:** No
- **Body:**
  ```json
  {
    "email": "email@example.com"
  }
  ```
- **Success response (200):**
  ```json
  {
    "message": "Login successful",
    "token": "jwt_token"
  }
  ```

### 4. Lấy Thông Tin Người Dùng (Get User Profile)

**Tiếng Việt:**
- **Endpoint:** `GET /api/users/profile`
- **Mô tả:** Lấy thông tin người dùng hiện tại dựa trên token
- **Yêu cầu xác thực:** Có (JWT Token)
- **Headers:**
  ```
  Authorization: Bearer jwt_token
  ```
- **Phản hồi thành công (200):**
  ```json
  {
    "user": {
      "id": "user_id",
      "name": "Tên Người Dùng",
      "email": "email@example.com",
      "type": "user",
      "isActive": true
    }
  }
  ```

**English:**
- **Endpoint:** `GET /api/users/profile`
- **Description:** Get current user information based on token
- **Authentication required:** Yes (JWT Token)
- **Headers:**
  ```
  Authorization: Bearer jwt_token
  ```
- **Success response (200):**
  ```json
  {
    "user": {
      "id": "user_id",
      "name": "User Name",
      "email": "email@example.com",
      "type": "user",
      "isActive": true
    }
  }
  ```

### 5. Cập Nhật Thông Tin Người Dùng (Update User Profile)

**Tiếng Việt:**
- **Endpoint:** `PUT /api/users/profile`
- **Mô tả:** Cập nhật thông tin người dùng hiện tại
- **Yêu cầu xác thực:** Có (JWT Token)
- **Headers:**
  ```
  Authorization: Bearer jwt_token
  ```
- **Body:** (Tất cả các trường đều là tùy chọn)
  ```json
  {
    "name": "Tên Mới",
    "email": "email_moi@example.com",
    "currentPassword": "mật_khẩu_hiện_tại",
    "newPassword": "mật_khẩu_mới"
  }
  ```
- **Phản hồi thành công (200):**
  ```json
  {
    "message": "Cập nhật thông tin thành công",
    "user": {
      "id": "user_id",
      "name": "Tên Mới",
      "email": "email_moi@example.com",
      "type": "user",
      "isActive": true
    },
    "token": "jwt_token_mới" // Chỉ trả về khi email thay đổi
  }
  ```
- **Lưu ý:**
  - Để thay đổi mật khẩu, phải cung cấp cả `currentPassword` và `newPassword`
  - Khi email thay đổi, token mới sẽ được tạo và trả về

**English:**
- **Endpoint:** `PUT /api/users/profile`
- **Description:** Update current user information
- **Authentication required:** Yes (JWT Token)
- **Headers:**
  ```
  Authorization: Bearer jwt_token
  ```
- **Body:** (All fields are optional)
  ```json
  {
    "name": "New Name",
    "email": "new_email@example.com",
    "currentPassword": "current_password",
    "newPassword": "new_password"
  }
  ```
- **Success response (200):**
  ```json
  {
    "message": "Profile updated successfully",
    "user": {
      "id": "user_id",
      "name": "New Name",
      "email": "new_email@example.com",
      "type": "user",
      "isActive": true
    },
    "token": "new_jwt_token" // Only returned when email changes
  }
  ```
- **Notes:**
  - To change password, both `currentPassword` and `newPassword` must be provided
  - When email changes, a new token will be created and returned

### 6. Lấy Danh Sách Người Dùng (Get All Users)

**Tiếng Việt:**
- **Endpoint:** `GET /api/users/all`
- **Mô tả:** Lấy danh sách tất cả người dùng (trừ admin)
- **Yêu cầu xác thực:** Không (nhưng thường nên giới hạn cho admin)
- **Phản hồi thành công (200):**
  ```json
  [
    {
      "id": "user_id_1",
      "name": "Tên Người Dùng 1",
      "username": "username1",
      "email": "email1@example.com",
      "type": "user",
      "isActive": true
    },
    {
      "id": "user_id_2",
      "name": "Tên Người Dùng 2",
      "username": "username2",
      "email": "email2@example.com",
      "type": "user",
      "isActive": false
    }
  ]
  ```

**English:**
- **Endpoint:** `GET /api/users/all`
- **Description:** Get list of all users (excluding admins)
- **Authentication required:** No (but typically should be restricted to admins)
- **Success response (200):**
  ```json
  [
    {
      "id": "user_id_1",
      "name": "User Name 1",
      "username": "username1",
      "email": "email1@example.com",
      "type": "user",
      "isActive": true
    },
    {
      "id": "user_id_2",
      "name": "User Name 2",
      "username": "username2",
      "email": "email2@example.com",
      "type": "user",
      "isActive": false
    }
  ]
  ```

### 7. Cập Nhật Trạng Thái Người Dùng (Update User Status)

**Tiếng Việt:**
- **Endpoint:** `PATCH /api/users/:id/status`
- **Mô tả:** Cập nhật trạng thái hoạt động của người dùng
- **Yêu cầu xác thực:** Không (nhưng thường nên giới hạn cho admin)
- **Tham số đường dẫn:**
  - `id`: ID của người dùng cần cập nhật
- **Body:**
  ```json
  {
    "isActive": true // hoặc false
  }
  ```
- **Phản hồi thành công (200):**
  ```json
  {
    "message": "User status updated successfully",
    "user": {
      "id": "user_id",
      "name": "Tên Người Dùng",
      "email": "email@example.com",
      "isActive": true
    }
  }
  ```

**English:**
- **Endpoint:** `PATCH /api/users/:id/status`
- **Description:** Update user's active status
- **Authentication required:** No (but typically should be restricted to admins)
- **Path parameters:**
  - `id`: ID of the user to update
- **Body:**
  ```json
  {
    "isActive": true // or false
  }
  ```
- **Success response (200):**
  ```json
  {
    "message": "User status updated successfully",
    "user": {
      "id": "user_id",
      "name": "User Name",
      "email": "email@example.com",
      "isActive": true
    }
  }
  ```

## Mã Lỗi Chung (Common Error Codes)

**Tiếng Việt:**
- **400 Bad Request:** Yêu cầu không hợp lệ hoặc thiếu thông tin
- **401 Unauthorized:** Không có quyền truy cập hoặc token không hợp lệ
- **403 Forbidden:** Không có quyền thực hiện hành động
- **404 Not Found:** Không tìm thấy tài nguyên
- **500 Internal Server Error:** Lỗi máy chủ

**English:**
- **400 Bad Request:** Invalid request or missing information
- **401 Unauthorized:** No access rights or invalid token
- **403 Forbidden:** No permission to perform action
- **404 Not Found:** Resource not found
- **500 Internal Server Error:** Server error
