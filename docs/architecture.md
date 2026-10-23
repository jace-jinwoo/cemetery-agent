# 아키텍처

## 기술

- Next.js App Router, TypeScript strict, React Server Components
- PostgreSQL, Prisma
- Tailwind CSS v4
- 검증은 Zod
- 변경은 Server Action. S3 presign과 외부 웹훅만 Route Handler
- 차트는 통계 단계에서 Recharts
- 패키지 매니저는 pnpm
- 앱 루트는 저장소 루트. `reference/`는 빌드·타입체크·린트에서 제외한다

## 디렉터리

```
src/app          라우트, 레이아웃
src/features     도메인 UI, action, service
src/components   공통 레이아웃과 UI
src/lib          db, auth, 검증, 테넌트 가드
prisma           schema, migration, seed
docs             요구사항, 아키텍처, 데이터 모델, 결정, 진행
```

의존 방향: UI → application service → data access → DB.

업무 규칙은 UI 컴포넌트에 두지 않는다. 시드 데이터는 `prisma/seed`에만 둔다. Figma 샘플 인명은 시드로 가져오지 않는다.

Phase 1은 라우트와 공통 레이아웃만 있다. 도메인 모듈은 해당 Phase에서 `src/features`에 추가한다.

## 인증, 인가, 테넌트

Phase 2에서 구현한다.

- 이메일·비밀번호 세션. Auth.js Credentials
- 세션의 사용자와 소속 묘원만 신뢰한다
- 요청에 실린 `cemetery_id`로 권한을 정하지 않는다
- 소속은 `cemetery_membership`으로 판별한다
- 모든 테넌트 조회는 서버에서 `cemetery_id`를 조건에 넣는다
- 단건 조회 후에도 리소스의 `cemetery_id`가 세션 묘원과 같은지 확인한다
- 묘원 역할은 묘원 관리자, 계약 담당자, 수납 담당자, 현장 담당자다. 복수 역할을 허용하고 묘원별 권한 조정을 둔다
- SaaS 운영자는 묘원 관리자와 다른 주체다. 묘원 개인정보 열람은 기본으로 주지 않는다
- 기본 권한표는 제안값이다. `docs/decisions.md`를 따른다

## 데이터 접근

- 계약, 청구, 입금의 상태 변경은 한 트랜잭션에서 처리한다
- 운영 데이터의 물리 삭제는 쓰지 않는다. `deleted_at`은 현재 행용이다
- 계약, 묘역 배정, 안치, 수납, 해약·이장 이력과 감사 로그는 추가만 한다
- 금액은 원 단위 `Decimal(14, 0)`
- 날짜만 의미 있으면 `DATE`, 시각이 필요하면 `timestamptz`
- 회원번호, 계약번호, 묘적번호, 예정지계약번호는 분리하고 묘원별 채번 형식을 설정한다
- 수납 원장은 청구, 입금, 충당이다. 약정 금액과 섞지 않는다

## 파일

S3 presigned PUT. DB에는 object key, 원본 파일명, content type, 크기, checksum을 둔다. 공개 URL을 저장하지 않는다.

기술 기본값: PDF, JPEG, PNG. 최대 20MB. 운영 정책으로 바뀌면 이 문서를 고친다.

## 오류

Server Action 결과는 `{ ok: true, data } | { ok: false, message, fieldErrors? }`로 맞춘다. 응답 메시지와 로그에 주민등록번호, 비밀번호, 토큰을 넣지 않는다.

## 외부 연동

`src/lib/integrations`에 전자서명, 알림, 결제 인터페이스를 둔다. 구현체가 없으면 화면과 문서에 연동 완료라고 쓰지 않는다.

## 화면 셸

Desktop first. 좌측 사이드바 `#1E3A2B`, 강조 `#3B7A57`, 배경 `#F3F6F4`, 흰 카드. 상태색은 성공 `#10B981`, 경고 `#F59E0B`, 위험 `#EF4444`.

Phase 1 검색창은 비활성이다. 검색이 되는 것처럼 보이지 않게 한다.
