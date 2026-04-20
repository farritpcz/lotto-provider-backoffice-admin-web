# Operators UI — backoffice-admin-web

> Last updated: 2026-04-20 (v1 initial — starter rule)
> Related code: `src/app/operators/page.tsx`

## 🎯 Purpose
admin จัดการ operator accounts: CRUD + suspend + regen API key — เป็นฟีเจอร์หลักที่ไม่มีใน standalone

## 📋 Rules
1. **Route**: `/operators`
2. **Data flow**: `adminApi.operators.list()`, `.get(id)`, `.create(data)`, `.update(id, data)`, `.toggleStatus(id, status)`
3. **Create operator**:
   - Required: username, display_name, password (optional autogen), initial API key toggle
   - Backend gen `api_key` + `secret_key` (secret แสดง 1 ครั้ง)
4. **Suspend**: status active/suspended via `PUT /operators/:id/status` — ConfirmDialog + reason
5. **Reset API keys**: operator ทำเอง (ดู `api_keys_page.md`) — admin ไม่ควรแตะ (audit trail ต้องเป็นของ operator)
6. **No browser alert** — ใช้ `ConfirmDialog` + toast

## 🎨 UI Spec
- page-container + page-header + create button
- Table: username, display_name, status badge, total_bets_today (CountUp), last_login
- Row click → detail panel (info + recent activity + API key status)
- Status toggle: dropdown action (active/suspended)

## ⚠️ Edge Cases
- ลบ operator ที่มี bet pending → reject ที่ backend (soft-disable แทน)
- Username duplicate → backend 409 → toast error
- Operator offline แต่มี session ค้าง → suspend บังคับ logout (TBD)

## 🔗 Related
- Backend: `lotto-provider-backoffice-api/docs/rules/operator_management.md`
- Operator-side: `lotto-provider-backoffice-operator-web/docs/rules/api_keys_page.md`

## 📝 Change Log
- 2026-04-20: v1 initial skeleton
