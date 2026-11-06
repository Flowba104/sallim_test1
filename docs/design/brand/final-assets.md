# D3 최종 에셋 전달

[전체 미리보기](final-assets-overview.png) · [앱 에셋 사용 명세](../../../app/assets/brand/README.md)

최종 앱용 원본·PNG는 `app/assets/brand/`. 이 폴더의 기존 app-icon/mark/splash는 초기 디자인 초안으로 남겨 두고 U10에서는 최종 앱용 원본을 적용한다. 최종 심볼은 안내장 높이를 줄여 원형 adaptive 마스크에서도 여백을 확보했다. 48px 축소에서도 접힌 모서리와3개 목록기호를 구분할 수 있도록 선 두께를 유지했다.

온보딩3종 각각 라이트/다크 SVG·PNG, 12카테고리 currentColor SVG, 1024앱아이콘, adaptive 전경/배경/단색, 스플래시 중심이미지2종 및390×844 시각참고2종을 포함한다. 외부이미지/이미지 생성 API/추가설치 없음. SVG→PNG는 저장소 밖 기존 Playwright로 변환했고 브라우저를 닫았다. 정적서버는 사용하지 않았다.

[Android 공식 기준](https://developer.android.com/develop/ui/compose/system/icon_design_adaptive)에 따라 전경/배경을 분리하고 중심66/108영역을 계산했다. QA의 실제 Android 런처 확인·설정적용·네이티브 splash는 coder/lead 범위다. 픽셀/alpha 검사 결과는 아래 검증 기록을 따른다.

## 검증 결과

2026-11-06 · SVG25개 XML 파싱/외부 이미지·script 참조 없음, 카테고리12개 대응 및24×24/currentColor 검사 통과. PNG15개 크기·alpha 픽셀 검사 통과. 앱아이콘·adaptive 배경은1024×1024 모든 픽셀 불투명, adaptive 전경·단색은 투명배경 및 중앙66/108 안전범위 안이다. 각 PNG의 실제 경계·투명픽셀수·최대반경은 `app/assets/brand/manifest.json`에 기록했다. 최대반경313px 이하도 추가 검사하여 원형 마스크 여백을 확인했다.

실제 렌더링 미리보기를 육안 확인했고 카테고리12개·라이트/다크 온보딩·3가지 아이콘마스크에서 내용 잘림이 없었다. PNG 생성용 브라우저는 finally에서 종료, 정적서버는 시작하지 않음.
