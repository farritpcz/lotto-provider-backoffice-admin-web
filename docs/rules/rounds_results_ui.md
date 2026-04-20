# Rounds + Results UI — backoffice-admin-web

> Last updated: 2026-04-20 (v1 initial — starter rule)
> Related code: `src/app/rounds/page.tsx`, `src/app/results/page.tsx`

## 🎯 Purpose
admin สร้าง/ดูรอบหวย + กรอกผลรางวัล → trigger payout (รวม callback operator ทุกคน)

## 📋 Rules
1. **Routes**:
   - `/rounds` — list + create
   - `/results` — list history + submit ผลต่อรอบ
2. **Data flow**: `roundApi.list()`, `roundApi.create(data)`, `resultApi.list()`, `resultApi.submit(roundId, result)`
3. **Create round**: lottery_type + open_at + cutoff_at — validation client (open_at < cutoff_at) + server
4. **Submit result**:
   - Form depends on lottery_type (ไทย: 6-digit + 2-top + 3-top, หุ้น: 3-digit, ฯลฯ)
   - Preview ก่อน commit (dry-run)
   - ConfirmDialog 2-step (พิมพ์รหัสรอบยืนยัน)
   - Irreversible — แสดง warning
5. **No browser alert** — ใช้ `ConfirmDialog` + toast

## 🎨 UI Spec
- Table rounds: type badge, open_at, cutoff_at, status (open/closed/settled), total_bets count
- Row action: View / Submit result (if status=closed)
- Result form: dynamic field layout ตาม lottery_type
- Preview panel: แสดง winning bets + total payout + per-operator breakdown

## ⚠️ Edge Cases
- Round ที่ผ่าน cutoff แล้วแต่ยัง open → เตือน admin close ก่อน submit
- Submit ระหว่าง operator offline → backend queue callback retry (ไม่ block UI)
- Result ที่ submit ไปแล้ว → read-only, แสดง submitted_at + admin_id ที่กรอก

## 🔗 Related
- Backend: `lotto-provider-backoffice-api/docs/rules/results_settle.md`
- Lottery types: memory `lottery_types_structure`
- Callback to operator: `seamless_wallet.md`

## 📝 Change Log
- 2026-04-20: v1 initial skeleton
