# 진행

검증에 통과한 항목만 완료로 적는다.

| 단계 | 상태 | 내용 |
| --- | --- | --- |
| 문서 | 완료 | requirements, architecture, data-model, decisions, progress |
| Phase 1 | 완료 | Next.js 셸, 공통 레이아웃, 메뉴 라우트. 데이터 연동 없음 |
| Phase 2 | 미착수 | PostgreSQL, Prisma, 인증, 권한 |
| Phase 3 | 미착수 | 계약, 연고자, 안치자, 묘역 |
| Phase 4 | 미착수 | 비용, 청구, 납부, 관리비 |
| Phase 5 | 미착수 | 상담, 민원, 해약, 이장, 문서 |
| Phase 6 | 미착수 | 대시보드, 통계, 설정 |
| Phase 7 | 미착수 | 테스트, 보안, 배포 준비 |

Q1–Q10 정책은 `docs/decisions.md`와 `docs/data-model.md`에 반영했다. 확인 필요 항목과 환불 산식, 주민번호 수집 근거는 확정하지 않았다. Phase 2 스키마는 아직 없다.

## Phase 1 검증

- `pnpm typecheck`: 통과
- `pnpm lint`: 통과. `eslint` 10과 `eslint-plugin-import` 등의 peer 범위(9까지)가 어긋난다는 경고는 있다. 린트 자체는 실패하지 않았다
- `pnpm test`: 통과, 4
- `pnpm build`: 통과. 라우트 18개 생성
- 브라우저: 대시보드, 계약 목록, 신규 계약, 계약 상세, 설정·권한관리를 열었다. 검색창은 비활성이다. 없는 주소 `/missing-page`는 HTTP 404

Phase 1은 화면 껍데기다. 조회, 저장, 인증, Tenant 검증은 없다.
