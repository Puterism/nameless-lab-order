# 네임리스 커피 발주 시스템

- 네임리스 커피 발주 시스템은 **상품을 발주하고 관리하는 시스템**입니다.
- 발주처에서 관리자 업체의 상품을 발주할 수 있으며, 관리자는 발주받을 상품을 관리하거나 발주 현황을 확인할 수 있습니다.

## 로컬 실행 방법

0. Firebase 프로젝트 생성이 필요합니다. [Firebase 콘솔](https://console.firebase.google.com/)에서 프로젝트 생성 후 `.env` 파일을 생성한 뒤, 아래 항목에 맞는 값들을 입력하고 저장해주세요.

- Firebase 콘솔에서 값을 확인할 수 있습니다.

```
REACT_APP_FIREBASE_API_KEY = 'xxxxxxxxxxxxxxxxxxxxxxxxxxx'
REACT_APP_FIREBASE_AUTH_DOMAIN = 'xxxxxxxxxxxx.firebaseapp.com'
REACT_APP_FIREBASE_DATABASE_URL = 'https://xxxxxxxxxxx.firebaseio.com'
REACT_APP_FIREBASE_PROJECT_ID = 'xxxxxxxxxxxx'
REACT_APP_FIREBASE_STORAGE_BUCKET = 'xxxxxxxxxxxx.appspot.com'
REACT_APP_FIREBASE_MESSAGING_SENDER_ID = '123456789012'
REACT_APP_FIREBASE_APP_ID = 'x:xxxxxxxxxxxxx:web:xxxxxxxxxxxxxxxxxxxxx'
```


1. 필요한 패키지를 설치합니다. (npm)

```
npm i
```

2. Firebase Emulator를 실행합니다.

```
npm run db
```

3. 로그인을 위해 Firebase Emulator Suite (http://localhost:8002/auth) 에서 관리자 계정을 생성해야 합니다.
  
    - 계정을 생성하면서 `Custom Claims (optional)` 항목에 꼭 `{ "admin": true }`를 해주세요.


4. 리액트 개발 서버를 실행합니다.

```
npm start
```


5. 생성한 관리자 계정의 이메일과 비밀번호로 로그인합니다.

