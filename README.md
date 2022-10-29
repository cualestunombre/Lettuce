# [Lettuce] SNS 서비스 팀 프로젝트

<p align="center">
  <img width="100%" alt="Screen Shot 2022-10-29 at 8 34 00 PM" src="https://user-images.githubusercontent.com/101104214/198829285-8121c57b-dc5b-47d0-900b-1fad15b48118.png">
</p>

## 🖥️ 프로젝트 소개
온라인 사진 공유 및 소셜 네트워크 서비스를 제작하였습니다.

<br>

## 🕰️ 개발 기간
* 22.09.19일 - 22.09.30일

### 🧑‍🤝‍🧑 멤버 구성
 - BE  : **우석우** - LETTUCE 프로젝트 총괄, DataBase / socket 설계 / 실시간채팅 기능(socket.io)
 - BE : **정지웅** - 프로필 및 개인정보수정 페이지
 - BE : **최준현** - 로그인 & 회원가입 (카카오/네이버 API 적용), 메인페이지 구성 및 게시글 비디오 업로드
 - FE : **최고은** - LETTUCE 전체 프론트 구조 설계, 반응형 웹페이지 적용
 
### ⚙️ 개발 환경
- **OS** : Mac OS
- **모델링 툴** : Figma
- **개발 패턴** : MVC
- **언어** : `HTML CSS JavaScript`
- **IDE/에디터** : VSCode
- **웹서버** : 네이버 클라우드
- **DB** : MySQL
- **협업 툴** : Github + Git, Figma, Notion
- **프레임워크 / 라이브러리 / API / 모듈** : Bootstrap 5, jQuery, 
카카오 로그인 API, 네이버 로그인 API, passport, morgan, dotenv, soket, sequelize, express

<br>

## 📌 주요 기능

#### 로그인 
- DB 값 검증
- 카카오 및 네이버 소셜 로그인 지원

#### 회원가입
- ID 중복 체크
- 비밀번호 유효성 검사

#### 메인 페이지
- 게시글 업로드(사진,동영상 여러장), 게시글 (좋아요, 북마크,댓글)
- 팔로잉 팔로우 기능 및 팔로워 추천 기능
- 게시글 무한 스크롤 기능

#### 탐색 페이지
- 게시글 해시태그 등록 기능(해시태그로 게시물을 검색할 수 있음)

#### 채팅 페이지 
- 1:1 DM 기능 (상대방이 접속중인 지 확인 가능 + 상대방이 글을 입력 중인 지 확인할 수 있는 기능 + 사진을 채팅으로 보낼 수 있는 기능 + 상대방이 내 글을 읽었는 지 확인할 수 있는 기능 + 상대방에게 채팅 알람이 실시간으로 가는 기능)

#### 개인 정보 페이지
- 개인 프로필 및 정보 수정 기능 

<br>

## 🔗 링크

- **웹 URL** - <a href="http://49.50.167.217:8000/">LETTUCE로 이동</a>
- **Notion** - <a href="https://www.notion.so/1-Lettuce-5735f374fb9243eaba03b49a003ffff3" >LETTUCE Notion으로 이동</a>
