# STEM Education Project Structure (Next.js 13+)

## 1. Tổng quan cấu trúc thư mục

```
stem_ducation/
├── app/                # Next.js app directory (routing, layout, page, dynamic route)
│   ├── page.tsx        # Trang chủ ('/')
│   ├── chuong-trinh-hoc/
│   │   ├── page.tsx    # '/chuong-trinh-hoc'
│   │   └── [slug]/
│   │       └── page.tsx # '/chuong-trinh-hoc/:slug'
│   ├── hoc-vien-tieu-bieu/
│   │   └── page.tsx    # '/hoc-vien-tieu-bieu'
│   ├── tin-tuc/
│   │   ├── page.tsx    # '/tin-tuc'
│   │   └── [slug]/
│   │       └── page.tsx # '/tin-tuc/:slug'
│   ├── su-kien/
│   │   └── page.tsx    # '/su-kien'
│   ├── ve-chung-toi/
│   │   └── page.tsx    # '/ve-chung-toi'
│   ├── tuyen-dung/
│   │   └── page.tsx    # '/tuyen-dung'
│   ├── lien-he/
│   │   └── page.tsx    # '/lien-he'
│   └── layout.tsx      # Layout chung cho toàn bộ app
│
├── client/
│   └── src/
│       ├── components/ # Các component tái sử dụng (Header, Footer, Card, ...)
│       ├── hooks/      # Custom React hooks
│       ├── lib/        # Tiện ích, client, config, queryClient, ...
│       ├── data/       # Dữ liệu tĩnh, mock data
│       └── ui/         # Các UI component nhỏ (button, input, ...)
│
├── server/             # Code backend, API, database, ...
├── shared/             # Schema, type chung cho cả frontend/backend
├── public/             # Ảnh, file tĩnh
├── package.json        # Thông tin package, script
├── tsconfig.json       # Cấu hình TypeScript, alias (ví dụ: @/components)
└── ...
```

## 2. Giải thích vai trò từng phần
- **app/**: Định nghĩa route, layout, page, dynamic route. Mỗi thư mục/file là một route.
- **client/src/components/**: Component tái sử dụng, không phụ thuộc route.
- **client/src/hooks/**: Custom hooks cho toàn bộ app.
- **client/src/lib/**: Hàm tiện ích, queryClient, config, ...
- **client/src/data/**: Dữ liệu tĩnh, mock data.
- **client/src/ui/**: UI nhỏ, atomic component.
- **server/**: Code backend, API, database, migration, ...
- **shared/**: Schema, type chung cho cả frontend/backend.
- **public/**: Ảnh, file tĩnh.

## 3. Routing Next.js app directory
- Mỗi file `page.tsx` trong `app/` là một route.
- Route động: dùng `[param]` (ví dụ: `app/tin-tuc/[slug]/page.tsx` → `/tin-tuc/:slug`)
- Layout chung: `app/layout.tsx`.

## 4. Import alias `@/`
- Đã cấu hình trong `tsconfig.json`:
  ```json
  "paths": {
    "@/*": ["./client/src/*"],
    "@shared/*": ["./shared/*"]
  }
  ```
- Ví dụ import:
  ```tsx
  import Header from "@/components/Header";
  import { useToast } from "@/hooks/use-toast";
  ```

## 5. Lưu ý
- Không để logic route, page trong `client/src/pages/` nữa, hãy chuyển sang `app/`.
- Chỉ để component, hook, lib, data... trong `client/src` để tái sử dụng.
- Không import code từ `server/` vào client component.

## 6. Ví dụ tạo route mới
- Tạo `app/ve-chung-toi/page.tsx` để có route `/ve-chung-toi`.
- Tạo `app/tin-tuc/[slug]/page.tsx` để có route động `/tin-tuc/:slug`.

---
**Bạn chỉ cần tạo file page.tsx trong app/ cho mỗi route, còn lại giữ nguyên tổ chức component, hook, lib, ... trong client/src.**
