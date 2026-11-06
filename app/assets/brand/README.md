# SaLLiM 최종 브랜드 에셋 · D3

2026-11-06 · A 살림 노트 · 직접 그린 접힌 안내장 심볼. 단순 SVG 도형만 사용했다. 외부 브랜드/캐릭터/스톡 이미지/유료 생성 API 사용 없음. `docs/design/brand/`의 초기 아이콘보다 본 폴더가 앱 적용 우선이다. [전체 미리보기](../../../docs/design/brand/final-assets-overview.png).

| 파일 | 크기·투명도 | 사용 |
|---|---|---|
| app-icon.svg / app-icon.png | 1024×1024, 숲색 불투명 전체배경 | 일반 앱 아이콘. 정사각 원본, 코너 라운드를 굽지 않음 |
| adaptive-foreground.svg / .png | 1024×1024, 배경투명 | adaptive 전경. 일반 앱아이콘과 별도 사이즈로 중심 심볼 유지 |
| adaptive-background.svg / .png | 1024×1024, #2E5943 불투명 | adaptive 배경. 배경색은 colors.primary 라이트 고정 브랜드색 |
| adaptive-monochrome.svg / .png | 1024×1024, 흰색 도형+투명구멍 | themed icon용. 목록기호는 색칠한 흰판이 아닌 alpha 구멍 |
| mark.svg / mark.png | 1024×1024, 배경투명 | 원색 안내장 심볼, 별도 숲색 면 위에서 사용 |
| splash-icon.svg / .png | 1024×1024, 배경투명, 숲색 안내장 | OS splash의 중심 이미지. 배경은 colors.bg #F7F3E8 |
| splash-icon-dark.svg / .png | 1024×1024, 배경투명, 연녹색 안내장 | 다크 OS splash. 배경은 colors.bg dark #15231C |
| splash.png / splash-dark.png | 390×844, 각 테마 불투명 | 전체화면 시각 참고. OS splash에는 전체화면 이미지를 늘려 넣지 않고 중심 splash-icon을 사용 |
| onboarding-photo.svg / .png | 350×240, 바깥투명 | 사진 프레이밍+병 도형, 온보딩1 |
| onboarding-method.svg / .png | 350×240, 바깥투명 | 접힌 안내장+3단계, 온보딩2 |
| onboarding-region.svg / .png | 350×240, 바깥투명 | 집+요일 도형, 온보딩3 |
| onboarding-*-dark.svg / .png | 350×240, 바깥투명 | 다크 테마 명시 변형. 테마가 바뀌면 동일 비율 이미지 교체 |
| categories/*.svg | 24×24, fill none/currentColor stroke2 | 12카테고리. 대응은 categories/manifest.json |

## 적용 계약

설정 파일 변경은 coder 담당(U10). 일반 icon, adaptive foreground/background/monochrome, splash 중심이미지/배경을 위 파일로 연결한다. 앱 이름 SaLLiM, 슬로건 **삶을 간단하게**. 미리보기의 둥근 마스크는 검토용이며 에셋에 구워 넣지 않았다. PNG는 로컬 Chromium에서 SVG를 직접 렌더링했다. 이미지 안에 진행률/카메라 권한/강제 대기문구 없음.

카테고리 SVG의 currentColor는 `categoryColors[mode][group].text`로 주입한다. 글자는 SVG에 넣지 않았으므로 API 카테고리 label을 옆에 별도로 표시한다. 정적인 PNG에는 런타임 tint를 걸지 않는다. 온보딩 PNG는 preserve aspect350:240, width는 가용본문폭, 높이는240기준이며 글자200%에서 장식 높이만 줄일 수 있다.

## Adaptive 안전영역

[Android 공식 adaptive icon 설계](https://developer.android.com/develop/ui/compose/system/icon_design_adaptive)에 따라 108×108 기준 전경/배경 분리와 중심66×66 안전영역을 검토했다. 1024좌표로 안전영역은 x/y199.11~824.89, 심볼 경계는 x278~746/y264~760이며 안전영역 안에 있다. 심볼 468×496은 약49.4×52.3dp. 원형/사각 둥근 마스크 시각검토와 alpha 경계검사를 수행했다. 실제 기기 런처/EAS 빌드는 실행하지 않았다.

심볼 요소의 형태·색·비율을 일부분만 바꾸지 않는다. 재사용 시 전체 단순도형으로 스케일한다. 라이트/다크 온보딩은 tokens.json 의미색에서 계산한 값이며 원색 앱아이콘은 플랫폼테마와 무관한 브랜드색이다.
