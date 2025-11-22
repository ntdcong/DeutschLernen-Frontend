# Germanly 🇩🇪

**Germanly** là một nền tảng học tiếng Đức hiện đại, tập trung vào trải nghiệm người dùng mượt mà và hiệu quả học tập thông qua phương pháp Flashcard và các công cụ hỗ trợ thông minh.

Dự án được xây dựng với mục tiêu đơn giản hóa việc học từ vựng và ngữ pháp, giúp người học tiếp cận tiếng Đức một cách tự nhiên và thú vị hơn.

## 🚀 Công nghệ sử dụng

Dự án sử dụng các công nghệ web hiện đại nhất để đảm bảo hiệu năng và trải nghiệm phát triển tốt nhất:

- **Core Framework:** [Vue 3](https://vuejs.org/) (Composition API)
- **Build Tool:** [Vite](https://vitejs.dev/) - Tốc độ build và HMR cực nhanh.
- **Language:** [TypeScript](https://www.typescriptlang.org/) - Đảm bảo type safety và code chất lượng.
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) - Thiết kế giao diện nhanh chóng, hiện đại và responsive.
- **State Management:** [Pinia](https://pinia.vuejs.org/) - Quản lý trạng thái ứng dụng hiệu quả.
- **Routing:** [Vue Router](https://router.vuejs.org/)
- **HTTP Client:** [Axios](https://axios-http.com/)

## ✨ Tính năng chính

### 1. Hệ thống Flashcard thông minh
- **Quản lý bộ từ (Decks):** Tạo, sửa, xóa và quản lý các bộ từ vựng cá nhân.
- **Tìm kiếm & Sắp xếp:** Dễ dàng tìm kiếm bộ từ và sắp xếp theo thời gian hoặc số lượng từ vựng.
- **Chế độ học (Learn Mode):** Giao diện học tập tương tác, lật thẻ, đánh giá mức độ ghi nhớ.

### 2. Quản lý người dùng
- **Authentication:** Đăng ký và đăng nhập bảo mật.
- **Personalization:** Dữ liệu học tập được lưu trữ riêng biệt cho từng người dùng.

### 3. Giao diện & Trải nghiệm (UI/UX)
- **Responsive Design:** Tối ưu hiển thị trên mọi thiết bị (Mobile, Tablet, Desktop).
- **Dark Mode:** Hỗ trợ giao diện sáng/tối (tùy chỉnh theo hệ thống hoặc cài đặt).
- **Modern UI:** Thiết kế sạch sẽ, tối giản với các hiệu ứng micro-interactions tinh tế.

## 🛠 Xử lý dữ liệu & Kiến trúc

- **State Management:** Sử dụng **Pinia** để quản lý global state (Auth, Decks, Learning Session). Các store được module hóa để dễ dàng bảo trì.
- **API Integration:** **Axios** được cấu hình với interceptors để tự động xử lý JWT token và các lỗi mạng chung.
- **Component Design:** Áp dụng kiến trúc Atomic Design cơ bản, tách biệt các UI components (Buttons, Inputs) và Feature components (DeckList, Flashcard).

## 📦 Cài đặt và Chạy dự án

Đảm bảo bạn đã cài đặt [Node.js](https://nodejs.org/) (phiên bản 18+ khuyến nghị).

1. **Clone dự án:**
   ```bash
   git clone https://github.com/ntdcong/DeutschLernen-Frontend.git
   cd DeutschLernen-Frontend
   ```

2. **Cài đặt dependencies:**
   ```bash
   npm install
   ```

3. **Chạy môi trường phát triển:**
   ```bash
   npm run dev
   ```
   Truy cập `http://localhost:5173` để xem ứng dụng.

4. **Build cho production:**
   ```bash
   npm run build
   ```

*Developed with Food by Duy Cong*
