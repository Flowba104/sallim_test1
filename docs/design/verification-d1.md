# D1 토큰 검증

2026-11-06 · Python 표준 라이브러리로 tokens.json을 다시 읽고 sRGB 상대 휘도 대비를 계산했다. 텍스트 조합 4.5:1 이상, 경계·포커스3:1 이상을 assert했다. 모든 assert 통과.

| 테마 | 전경 토큰 | 배경 토큰 | 대비 |
|---|---|---|---|
| light | text | bg | 10.57:1 |
| light | text | surface | 11.60:1 |
| light | subtext | bg | 5.89:1 |
| light | subtext | surface | 6.47:1 |
| light | onPrimary | primary | 8.00:1 |
| light | onPrimary | primaryPressed | 10.50:1 |
| light | warn | warnBg | 7.74:1 |
| light | error | errorBg | 5.79:1 |
| light | disabledText | disabledBg | 5.03:1 |
| light | placeholder | surface | 6.47:1 |
| light | text | tint | 9.74:1 |
| light | recycle.text | recycle.bg | 6.65:1 |
| light | general.text | general.bg | 7.00:1 |
| light | food.text | food.bg | 6.81:1 |
| light | special.text | special.bg | 7.00:1 |
| light | border | surface | 3.33:1 |
| light | focus | surface | 7.92:1 |
| dark | text | bg | 14.68:1 |
| dark | text | surface | 12.53:1 |
| dark | subtext | bg | 9.66:1 |
| dark | subtext | surface | 8.25:1 |
| dark | onPrimary | primary | 8.15:1 |
| dark | onPrimary | primaryPressed | 6.41:1 |
| dark | warn | warnBg | 8.33:1 |
| dark | error | errorBg | 7.73:1 |
| dark | disabledText | disabledBg | 6.11:1 |
| dark | placeholder | surface | 8.25:1 |
| dark | text | tint | 8.97:1 |
| dark | recycle.text | recycle.bg | 5.93:1 |
| dark | general.text | general.bg | 7.39:1 |
| dark | food.text | food.bg | 7.09:1 |
| dark | special.text | special.bg | 7.36:1 |
| dark | border | surface | 4.27:1 |
| dark | focus | surface | 10.13:1 |

추가 확인: JSON 파싱, 라이트/다크 색 키 동일, colors=themes.light.colors, 카테고리12개 중복 없이 API 이름 일치. 390폭 본문350에서 요일7칸48.29px(간격2), 320폭에서는4+3줄 사용.

기기 캡처·Pretendard 로딩·TalkBack·200% 글자·safe area는 미검증이며 D4 구현 QA에서 별도 확인한다. 장식 divider는 텍스트/필수 경계로 사용하지 않는다.
