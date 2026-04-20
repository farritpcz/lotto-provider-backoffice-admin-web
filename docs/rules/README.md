# Rules — lotto-provider-backoffice-admin-web (#10)

> Last updated: 2026-04-20
> Source of truth: ทุก feature ของ repo นี้ต้องมี rule file ใน folder นี้
> Cross-repo standards: `../../../lotto-system/docs/coding_standards.md`

## วิธีใช้
- ทุก feature ต้องมี `{feature}.md` เก็บ rules + edge cases
- แก้โค้ด feature ไหน → update rule file ในคอมมิตเดียวกัน (BLOCKING)
- Format: ดูตัวอย่าง `C:/project/lotto-standalone-admin-api/docs/rules/member_levels.md`

## Rules ปัจจุบัน
- [backoffice_admin.md](./backoffice_admin.md) — Provider admin dashboard + CRUD (operators, members, lotteries, results, bans, rates, reports, settings)

## Related repos
- Backend: `lotto-provider-backoffice-api` (#9) — serves this UI at `/api/v1/admin/*`
- Sibling: `lotto-provider-backoffice-operator-web` (#11) — operator self-service portal
- Similar UI in standalone mode: `lotto-standalone-admin-web` (#6)

## Status
WIP — หน้าส่วนใหญ่ยัง stub / ยังไม่ fetch API จริง (เช่น `dashboard/page.tsx` มี TODO "fetch จาก dashboardApi.getStats()")
