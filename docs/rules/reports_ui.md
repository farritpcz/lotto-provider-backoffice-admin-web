# Reports UI — backoffice-admin-web

> Last updated: 2026-04-20 (v1 initial — starter rule)
> Related code: `src/app/reports/page.tsx`

## 🎯 Purpose
admin ดูรายงาน: summary ทั้งระบบ, profit ต่อช่วงเวลา, breakdown ต่อ operator — ใช้ตัดสินใจ operational + finance

## 📋 Rules
1. **Route**: `/reports`
2. **Data flow**: `reportApi.summary(range)`, `reportApi.profit(range, group_by)`, `reportApi.byOperator(range)`
3. **Tabs/sections**:
   - Summary: total bets / win / profit / top operators
   - Profit: timeseries chart (daily/weekly)
   - By Operator: ranking table + CSV export
4. **Date range**: preset (วันนี้ / 7 วัน / 30 วัน / เดือนนี้ / custom) — default 30 วัน
5. **Group by**: `group_by=day|week|month` สำหรับ profit chart
6. **Export**: CSV ต่อ tab — chunk query ฝั่ง backend ถ้าแถวเยอะ

## 🎨 UI Spec
- page-container + sticky filter bar + tabs
- KPI cards (CountUp) บน summary tab
- Chart: Recharts line + bar (ดูแนวเดียวกับ dashboard)
- DataTable: sortable + CSV export button
- Loading skeleton + EmptyState

## ⚠️ Edge Cases
- Range 0 ผล → EmptyState "ไม่มีข้อมูลในช่วงนี้"
- Range ใหญ่ (> 365 วัน) → backend อาจช้า → UI แสดง progress / ข้อความเตือน
- Operator ที่ถูกลบ/suspend ระหว่างทาง → ยังปรากฏในรายงานด้วย tag "ปิดใช้งาน"

## 🔗 Related
- Backend: `lotto-provider-backoffice-api/docs/rules/admin_dashboard.md` (โครง aggregation คล้ายกัน)
- Chart lib: Recharts
- Auth: `admin_auth_jwt.md`

## 📝 Change Log
- 2026-04-20: v1 initial skeleton
