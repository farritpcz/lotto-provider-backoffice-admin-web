# Backoffice Admin — provider-backoffice-admin-web (#10)

> Last updated: 2026-04-20 (v1 initial — starter rule, expand as feature matures)
> Related code: `src/app/dashboard/page.tsx`, `src/app/operators/page.tsx`, `src/app/members/`, `src/app/lotteries/`, `src/app/rounds/`, `src/app/results/`, `src/app/bans/`, `src/app/rates/`, `src/app/reports/`, `src/app/transactions/`, `src/app/settings/`, `src/app/login/`
> Status: WIP — หลายหน้ายังเป็น placeholder (ดู dashboard page มี TODO)

## Purpose
Provider admin dashboard — ดูแลทั้งระบบ provider: CRUD operators, monitor members/bets ทุก operator, กรอกผลรางวัล, จัดการอัตราจ่าย, reports รวม + แยกตาม operator

## Rules
1. ⭐ ต่างจาก standalone admin (#6): หน้านี้ "เห็นทุก operator" + มีหน้า `operators/` จัดการ operator (ไม่มีในโหมด standalone)
2. ทุก request ต้องแนบ Admin JWT (TODO: ยังไม่มี middleware จริง — ดู backoffice-api router.go)
3. ห้ามใช้ `alert()` / `confirm()` — ใช้ state-driven modal / ConfirmDialog (ดู `memory/feedback_no_browser_alert`)
4. เรียก backend ผ่าน `@/lib/api` → `adminApi.*` → `/api/v1/admin/*` ของ backoffice-api (#9)
5. หน้า `operators/` สร้าง operator ได้ + backend gen `api_key`/`secret_key` อัตโนมัติ (secret แสดงครั้งเดียว)
6. ผลรางวัล: admin กรอกผ่าน `results/` → POST `/admin/results/:roundId` → trigger payout ที่ backend
7. Dashboard stats ต้องมี: total_operators, active_operators, total_members, total_bets_today, total_amount_today, total_win_today

## Pages
- `/login` — admin login
- `/dashboard` — ภาพรวมทั้งระบบ (stub)
- `/operators` — CRUD operator + API keys (มี form แล้ว)
- `/members`, `/lotteries`, `/rounds`, `/results` — CRUD + monitoring
- `/bans`, `/rates`, `/transactions`, `/reports`, `/settings` — config + analytics

## Edge Cases
- Operator ถูก suspend → ต้อง filter ใน dropdown + reports
- Secret key ห้ามเก็บลง state นานเกินจำเป็น (แสดงครั้งเดียวตอนสร้าง)
- Dashboard ช่วงที่ไม่มีข้อมูลวันนี้ → แสดง 0 ไม่ใช่ `-` / `NaN`

## Related
- Backend counterpart: `lotto-provider-backoffice-api` internal/handler/admin_handlers.go
- Operator-side UI: `lotto-provider-backoffice-operator-web`

## Change Log
- 2026-04-20: v1 initial skeleton
