# 前端程式設計 HW4 - 個人履歷網站
>我是蔡采佳 Jessica Tsai，目前是台灣大學生物環境系統工程學系四年級的學生，因為對程式語言很有興趣，加上這學期修了一堂「前端程式設計」課程，其中之一的作業讓我完成了這份線上履歷，若有任何問題，網站內有聯絡資訊，歡迎聯絡我，謝謝！


### 網站內容簡介
- About Me (我的基本資料、自我介紹)
- Why Choose Me (我的個人特質、技能介紹)
- Experience (活動經歷)
  - Learning Experience (學習歷程)
  - Important Experience (重要經歷)
  - Extracurricular Activities (課外活動)
- My Portfolio (我的作品集)
- Contact Me

### 小亮點
1. 網站的 favicon
<pre><code><img src='/img/favicon.jpg'></img>
</code></pre>

2. 標籤頁的網站名稱
<pre><code>Jessica Tsai's Resume</img>
</code></pre>

3. 第一次跑出網站時，連續往下滾動，每個區塊的標題會淡入，每個區塊的內容則會依序跳上來
4. 滑鼠只到照片、特定內容上內容會浮動變大
5. Extracurricular Activities部分內容的小標題有連結
6. My Portfolio 每個作品集有兩種icon，眼睛icon可以放大圖片，連結icon可以連到線上的作品介紹
7. My Portfolio 放大圖片後，左下角有圖片詳細的名稱
7. My Portfolio 下的作品集有分類，可以依照分類查看不同的作品
8. 網站內的 FB、IG、LinkedIn 都可以連結到我的個人頁面
9. 加入響應式功能，依照不同大小比例的螢幕做不同的排版調
10. 網站從上到下分不同區塊，可以從header上的標籤連結
10. 網站從上到下分不同區塊，每當滑到該區塊時，header上的標籤也會更改顏色
11. header上的標籤有下拉式選單
12. 在不需要無排序清單的符號時不顯示，需要的時候再顯示

### 參考code
1. why choose me 的 技能長條圖

```html
    <span>C/C++</span>
    <span class="pull-right">75%</span>
    <div class="progress">
      <div class="progress-bar" role="progressbar" style="width: 75%; background-color: #1bb1dc;" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100">
      </div>
    </div>
```

2. learning experience 的 學習歷程圖

index.html
```html
<ul class="timeline">
  <li>
    <div class="timeline-image">
      <img class="rounded-circle img-fluid" src="img/HSNU_Logo_bg.png" alt="123">
    </div>
    <div class="timeline-panel">
      <div class="timeline-heading">
        <h5>2012.9 - 2016.6</h5>
        <h4 class="subheading">HSNU <br>師大附中科學班</h4>
      </div>
      <div class="timeline-body">
        <ul class="text-muted">
          <li>專題研究能力優異，獲得中等學校學生科學獎助計畫三等獎、獲選青少年科學人才培育計畫</li>
          <li>舉辦科學班畢業成果發表，擔任美宣組組長，負責所有文宣品設計與訂製</li>
        </ul>
      </div>
    </div>
  </li>
</ul>
```
custom.css
```css
.timeline {
    position: relative;
    padding: 0;
    list-style: none;
}

.timeline:before {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 40px;
    width: 2px;
    margin-left: -1.5px;
    content: '';
    background-color: #e9ecef;
}

.timeline>li {
    position: relative;
    min-height: 50px;
    margin-bottom: 50px;
}

.timeline>li:after,
.timeline>li:before {
    display: table;
    content: ' ';
}

.timeline>li:after {
    clear: both;
}

.timeline>li .timeline-panel {
    position: relative;
    float: right;
    width: 100%;
    padding: 0 20px 0 100px;
    text-align: left;
}

.timeline>li .timeline-panel:before {
    right: auto;
    left: -15px;
    border-right-width: 15px;
    border-left-width: 0;
}

.timeline>li .timeline-panel:after {
    right: auto;
    left: -14px;
    border-right-width: 14px;
    border-left-width: 0;
}

.timeline>li .timeline-image {
    position: absolute;
    z-index: 100;
    left: 0;
    width: 80px;
    height: 80px;
    margin-left: 0;
    text-align: center;
    color: white;
    border: 7px solid #e9ecef;
    border-radius: 100%;
    background-color: #70cce6;
}

.timeline>li .timeline-image h4 {
    font-size: 10px;
    font-weight: bolder;
    line-height: 14px;
    margin-top: 12px;
}

.timeline>li.timeline-inverted>.timeline-panel {
    float: right;
    padding: 0 20px 0 100px;
    text-align: left;
}

.timeline>li.timeline-inverted>.timeline-panel:before {
    right: auto;
    left: -15px;
    border-right-width: 15px;
    border-left-width: 0;
}

.timeline>li.timeline-inverted>.timeline-panel:after {
    right: auto;
    left: -14px;
    border-right-width: 14px;
    border-left-width: 0;
}

.timeline>li:last-child {
    margin-bottom: 0;
}

.timeline .timeline-heading h4 {
    margin-top: 0;
    color: inherit;
    font-weight: bolder;
}

.timeline .timeline-heading h4.subheading {
    text-transform: none;
}

.timeline .timeline-body>ul,
.timeline .timeline-body>p {
    margin-bottom: 0;
}
```
### 模板資訊
Theme Name: Rapid

Theme URL: https://bootstrapmade.com/rapid-multipurpose-bootstrap-business-template/

Author: BootstrapMade.com

Author URL: https://bootstrapmade.com
