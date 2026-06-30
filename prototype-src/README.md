# MaeumTuk React Prototype Source

Flutter implementation handoff용 React/Vite 원본입니다.

## Folder Map

- `src/App.jsx`: 앱 상태, 탭 전환, 저장/검색/토스트 흐름 조립
- `src/data/`: QA용 샘플 툭 데이터
- `src/constants/`: 탭 정의 등 전역 상수
- `src/components/`: 여러 화면에서 쓰는 공통 UI
- `src/features/today/`: 오늘 탭
- `src/features/log/`: 툭로그 탭과 이어툭 UI
- `src/features/now/`: 요즘 탭
- `src/features/me/`: 나 탭
- `src/features/entry/`: 작성창, 날짜 시트, 손으로 남기기 시트
- `src/App.css`: 현재 프로토타입의 전체 시각 스타일
- `public/`: PWA, 아이콘, 마으미 SVG 등 정적 자산

## Flutter Handoff Note

`features/*` 단위는 Flutter의 screen/widget 단위로 옮기기 쉽게 나눈 경계입니다.
현재 프로토타입은 기능 확장 없이 모바일 UX QA 재현을 목표로 합니다.
