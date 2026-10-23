# 데이터 모델

소스는 `reference/data-model.md`다. 정책은 `docs/decisions.md`다.

테이블 이름: `transactions` → `contracts`, `mausoleums` → `plots`, `dead` → `deceased`. 소스 필드는 아래 매핑으로 남긴다. 중복 납부 컬럼과 주민번호 이중 컬럼은 원장·인물 모델로 모은다.

## 공통

테넌트 데이터는 `cemetery_id`를 가진다. 계약 하위는 계약의 묘원으로 조회한 뒤 서버에서 다시 확인한다.

현재 행: `id` PK, `created_at`, `updated_at`, `deleted_at`, 필요 시 `created_by`, `updated_by`.

금액 `Decimal(14, 0)`. 일자 `DATE`. 시각 `timestamptz`.

계약, 묘역 배정, 안치, 청구·입금·충당, 해약·이장 이력은 append-only다. 정정은 새 행이다.

## 엔터티

인물과 계약:

- `persons`: 묘원 공통 인물. 소스 `acquaintances`의 인적 필드
- `contract_parties`: 계약, 인물, 역할(계약자/신청자/연고자), `legacy_slot`, `is_primary_contact`
- `contracts`: 소스 `transactions`. 예정지와 사용 계약은 별도 행. 사용 계약은 `source_contract_id`
- `contract_settlements`: 예정지 입금을 사용 계약에 연결. 입금 행은 옮기지 않음
- `deceased`: 소스 `dead`에서 연고자 FK와 주민번호 중복을 뺀 안치자
- `deceased_persons`: 안치자 N:M 인물
- `family_relationships`: 고인-인물 가족관계. 역할 변경과 무관
- `interment_events`: 안치 상태 이력. 허용 값은 확인 필요

묘역:

- `plots`: 소스 `mausoleums`. 현재 계약 FK 없음. `legacy_member_number`에 소스 `member_number` 원본 보존
- `plot_assignments`: 배정 이력. 계약 N:M 묘역을 기간으로 표현
- `relocations`: 내부(`to_plot_id`)와 외부(`destination`). 현장 확인 전 재사용 불가
- `plot_reuse_confirmations`: 현장 확인 이력

수납:

- `contract_cost_lines`: 약정 금액. 소스 `costs` 와이드 금액, `cost_items`, `additional_costs`
- `stone_objects`: 석물. 화병 포함. 소스 `vases`의 size는 석물 행의 `size`
- `engravings`, `maintenances`: 작업 기록. 금액은 청구로 연결
- `management_fees`: 관리 기간과 대상 금액, `management_fee_sequence`. `is_paid`, `paid_at`은 저장 원장이 아님
- `charges`: 청구 항목. `installment_sequence`는 분할납부 회차
- `payments`: 입금. 여러 행
- `payment_allocations`: 충당
- `cemetery_settings`: 단가, 채번 형식, 충당 순서, 장기미납 일수·횟수
- `stone_costs`: 묘원 석물 기준 단가

권한:

- `users`: 계정
- `platform_operators`: SaaS 운영자. 묘원 역할과 별도
- `cemetery_memberships`: 사용자-묘원
- `membership_roles`: 복수 역할
- `role_permissions`: 묘원별 조정. 기본값은 제안표

기록:

- `contract_histories`, `consultations`, `documents`, `memos`
- `cancellations`: 담당자 산정액, 관리자 승인. 산식 없음
- `refund_policies`: 묘원별 규칙 자리. 산식은 비활성
- `audit_logs`: 추가 전용. 민감정보 원문 없음
- `cemetery_profile_images`

만들지 않음: `vases`, 검색 이력 2종, 지도 좌표 3종, `plots.transaction_id`, 주민번호 이중 컬럼.

## 관계

```
Cemetery 1─* Person
Cemetery 1─* Contract
Cemetery 1─* Plot
Contract 1─* ContractParty *─1 Person
Contract 0..1─1 Contract (source_contract_id, 예정지→사용)
Contract 1─* Deceased
Deceased *─* Person
Deceased *─* Person : family_relationships
Contract *─* Plot : plot_assignments (기간)
Contract 1─* Charge
Payment 1─* PaymentAllocation *─1 Charge
Contract 1─* Payment
Contract 1─* Cancellation|Relocation|Consultation|Memo|Document|ContractHistory
User *─* Cemetery : membership_roles
```

## 소스 필드 매핑

접두어: `m` 묘역, `t` 계약, `a` 연고자, `d` 안치자, `c` 상담, `mf` 관리비.

### cemeteries

| 소스 | 컬럼 | 비고 |
| --- | --- | --- |
| 묘원명 | name | |
| 주소 | address | |
| 설명 | description | |
| 활성화 | is_active | |
| 공원명 등 | legal_name, business_number, representative_name, phone, fax, email | 설정 화면 필드. 형식 검증은 미확정 |

설정으로 추가하는 제안값: 채번 패턴, 충당 순서, `long_overdue_days` 기본 90, `long_overdue_count` 기본 2.

### plots (`mausoleums`)

| 소스 | 컬럼 | 비고 |
| --- | --- | --- |
| 묘원 | cemetery_id | FK |
| 계약 | transaction_id | 단일 FK로 두지 않음. `plot_assignments` |
| 묘적번호/회원번호 | legacy_member_number | 원본 보존. 회원번호·묘적번호로 자동 분배하지 않음 |
| 묘적번호 | plot_number | 분리된 번호. 비어 있을 수 있음 |
| 단지 | complex | |
| 구역 | area | |
| 열 | row_number | |
| 번호 | number | |
| 묘지 형태 | tomb_type | |
| 기수 | number_of_tombs | |
| 평형 | area_size | |
| 사용기간 | period | |
| 기타 | etc | |
| 묘역 상태 | plot_status | 화면 값. 해약·이장 완료로 판매가능이 되지 않음 |

### plot_assignments

| 컬럼 | 비고 |
| --- | --- |
| plot_id, contract_id | |
| valid_from, valid_to | 종료해도 행을 지우지 않음 |
| ended_reason | |

### contracts (`transactions`)

| 소스 | 컬럼 | 비고 |
| --- | --- | --- |
| 묘원 | cemetery_id | |
| 계약번호 | contract_number | 묘원별 유니크. 기존 번호 유지 |
| 회원번호 | member_number | 계약에 보존. 인물 회원번호와 별도 축 |
| 예정지계약번호 | reserved_contract_number | 예정지 행 |
| 계약일 | contract_date | 최초계약일자 |
| 유형 | type | 신규/이장/해약/예정지. 현재 상태 아님 |
| 계약 상태 | contract_status | 상담/예약/계약/해약 |
| 서명 상태 | signing_status | 별도. 연동 전 전이 없음 |
| 사용 전환 | source_contract_id | 사용 계약 → 예정지 |
| 장례구분1 | burial_type_1 | 입관/퇴관/납골 |
| 장례구분2 | burial_type_2 | 쌍분/단분/합장/납골 봉안/납골 매장 |
| 메모 | memo | |
| 등록·수정자 | created_by, updated_by | |

예정지 화면의 전체관리번호, 사용회원번호, 사용계약일자, 사용평수, 사용여부는 네 번호와 합치지 않는다. 전체관리번호·사용회원번호는 확인 필요. 사용계약일자·사용평수·사용여부는 사용 계약 행과 승계된 배정의 값으로 둔다.

### persons (`acquaintances` 인적 필드)

| 소스 | 컬럼 | 비고 |
| --- | --- | --- |
| 성명 | name | |
| 주민번호 | resident_registration_number | `ssn`과 `resident_number`를 통합. 암호화, 기본 null |
| 전화 | phone, phone2, phone3, phone4 | 휴대폰, 연락처1, 연락처2, 자택 |
| 이메일 | email | |
| 기타 | etc_info | |
| 주소 | address, road_address, address_detail, zip_code | |
| 메모 | memo | |
| 회원번호 | member_number | 묘원 인물 번호. 계약 회원번호와 자동 동기화하지 않음 |

### contract_parties

| 소스 | 컬럼 | 비고 |
| --- | --- | --- |
| 계약 | contract_id | |
| 인물 | person_id | |
| 역할 | role | contractor, applicant, acquaintance. 복수 허용 |
| 주 연락처 | is_primary_contact | 계약자 역할이 아님 |
| 신청자2/3 | legacy_slot | 레거시 UI 번호. 의미는 확인 필요 |

### deceased (`dead`)

| 소스 | 컬럼 | 비고 |
| --- | --- | --- |
| 계약 | contract_id | |
| 연고자 | acquaintance1_id, acquaintance2_id | 사용하지 않음. `deceased_persons` |
| 성명 | name | |
| 성별 | gender | 남/여 |
| 주민번호 | resident_registration_number | 한 컬럼. 기본 필수 아님 |
| 장례구분 | burial_method, burial_method_1, burial_method_2 | |
| 분묘 종류 | tomb_type | 소스에 미사용. 묘역 유형과 같은지 확인 필요. 컬럼은 유지 |
| 사망일 | death_date | |
| 사망 원인 | death_cause | |
| 사망 장소 | death_place | |
| 주소 | address, zip_code, address_detail | 화면 봉안정보의 우편번호·상세주소 포함 |
| 설묘일 | burial_date | |
| 위치 | plot_node_id | 보존만. FK 아님. 의미 확인 필요 |
| 관계 | — | 안치자 컬럼이 아님. `family_relationships` |
| 메모 | memo | |
| 안치 상태 | interment_status | 묘역 상태와 별도. 허용 값 확인 필요 |

`family_relationships`: deceased_id, person_id, relationship, relationship_custom, recorded_at. 수정은 새 행이다.

`interment_events`: deceased_id, status, recorded_at, recorded_by. 현재 값은 최신 행이다.

### 약정 금액

납부 상태, 납부수단, 납부일은 이 테이블에 두지 않는다. 청구·입금·충당에 매핑한다.

`contract_cost_lines`로 모으는 소스 금액:

- `costs`: usage_fee, management_fee, burial_work_fee, installation_fee, repair_fee, removal_work_fee, other_work_fee, stone_processing_fee, agency_fee, total_cost, stone_cost, memo
- `cost_items`: cost_name, fee
- `additional_costs`: cost_name, amount, memo, created_by

`costs`의 항목별 status, payment_method, payment_date와 `cost_items`, `additional_costs`의 같은 의미 컬럼은 `charges`와 `payments`다.

신규 계약 화면의 계약금, 중도금, 잔금, 시설비는 `costs` 컬럼과 같은 항목으로 단정하지 않는다. 분할납부이면 `charges.installment_sequence`다.

### 석물과 작업

`stone_objects`: order_index, stone_name, cost, stone_type(묘테/상석/비석/화병/기타), stone_material, stone_size, stone_quantity, stone_unit_price, stone_total_price, stone_memo, size(소스 `vases.size`).

소스 `vases`의 payment_status, payment_method, payment_date는 청구·입금이다.

`stone_costs.stone_type`의 묘태와 석물 묘테는 확인 필요. 코드를 하나로 합치지 않는다.

`engravings`: created_by, engraving_type, content, character_count, cost_per_character, total_cost, engraving_date, status(pending/in_progress/completed), memo, content_file, content_file_name. fee, fee_status, payment_method, payment_date는 청구·입금.

`maintenances`: created_by, completed_by, maintenance_type(repair/cleaning/inspection/replacement/other), content, maintenance_date, cost, status(pending/in_progress/completed/cancelled), memo. cost의 납부는 청구·입금.

### 관리비와 수납 원장

`management_fees`: cemetery_id, contract_id, fee_period_start, fee_period_end, amount, due_date, memo, management_fee_sequence.

소스 `is_paid`, `paid_at`은 충당 결과로 계산한다.

화면 입금 정보의 단가, 입금금액, 입금구분, 차수:

- 단가: 약정 또는 관리비 산정 입력
- 입금금액: `payments.amount`
- 입금구분: 납부수단. 표준 목록은 확인 필요
- 차수: 관리비이면 `management_fee_sequence`, 분할납부이면 `installment_sequence`

`charges`: contract_id, source_type, source_id, amount, due_on, installment_sequence, management_fee_sequence.

`payments`: contract_id, amount, paid_on, method, memo. 예정지 입금은 그 계약에 남는다.

`payment_allocations`: payment_id, charge_id, amount, allocated_at.

`contract_settlements`: source_contract_id, target_contract_id, payment_id, amount, settled_at.

장기미납 여부는 묘원 설정의 일수·횟수로 계산한다. 기본 제안은 90일 또는 2회다.

### 기록

`contract_histories`: user_id, action(create/update/cost:add/cost:update/cost:delete), details. details에 주민번호·전화 원문 없음. 행 삭제 없음.

`consultations`: created_by, content, consultation_date. 화면 추가 필드: consultation_type, category, action_content, status(처리완료/처리중/미처리). 전이 규칙은 없다.

`documents`: document_type(death_certificate/burial_certificate/family_relation_certificate/family_register/cremation_certificate/privacy_consent/other), object_key, file_name, uploaded_at.

`memos`: cemetery_id, contract_id, created_by, updated_by, category(계약/개장/석물/관리비/장례/보수/기타), content.

### 해약·이장

`cancellations`: contract_id, cancelled_on, reason, assessed_amount, assessed_by, approved_by, approved_at, status(접수/처리중/완료/반려), note. 금액은 입력값이다. 산식으로 채우지 않는다.

`refund_policies`: cemetery_id, enabled=false, notes. 산식 컬럼은 근거 확인 후 추가한다.

`relocations`: contract_id, kind(internal/external), from_plot_id, to_plot_id, destination, moved_on, reason, status(접수/처리중/완료/반려), handler_id, note.

`plot_reuse_confirmations`: plot_id, relocation_id, confirmed_by, confirmed_at. 이 행 없이 묘역을 판매가능으로 여는 흐름은 만들지 않는다.

## 인덱스

- 테넌트 테이블 `cemetery_id`
- `(cemetery_id, contract_number)` 유니크
- `(cemetery_id, reserved_contract_number)` 유니크. null 제외
- `(cemetery_id, plot_number)` 유니크. null 제외
- 묘역 위치 `(cemetery_id, complex, area, row_number, number)`
- 배정 `(plot_id, valid_from)`, `(contract_id)`
- 청구·입금·충당의 FK
- 이력 테이블은 삭제 플래그로 걸러 내지 않음

## 정합성

계약 상태 변경, 청구 생성, 입금, 충당은 한 트랜잭션이고 이력을 남긴다.

묘역 상태와 계약 상태의 다른 자동 맞춤은 하지 않는다. 확정된 규칙은 해약·이장 완료가 묘역을 판매가능으로 만들지 않는다는 것이다.
