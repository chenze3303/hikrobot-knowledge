<script setup>
import { computed } from 'vue'
import Icon from '../components/Icon.vue'
import { categories } from '../data/categories'
import { getCategoryArticles, recentArticles, stats } from '../data/knowledge'
import id2020 from '../assets/id2020.png'

const categoryCards = computed(() =>
  categories.map((category) => ({
    ...category,
    count: getCategoryArticles(category.id).length
  }))
)

const quickPaths = [
  {
    title: '我要选型',
    desc: '按码制、工作距离和节拍，先锁定系列与型号。',
    icon: 'layers',
    to: '/category/selection',
    label: '进入选型'
  },
  {
    title: '我在现场调试',
    desc: '从安装、对焦、曝光到触发，把第一张图读出来。',
    icon: 'target',
    to: '/category/software',
    label: '开始调试'
  },
  {
    title: '我要对接产线',
    desc: 'TCP、串口、PLC 或 SDK，把结果稳定送进系统。',
    icon: 'network',
    to: '/category/integration',
    label: '查看集成'
  }
]

const hotDocs = [
  { title: '读不到码：10 步排查', slug: 'no-read', tag: '排障' },
  { title: 'TCP / UDP 触发与结果输出', slug: 'tcp-trigger', tag: '调试' },
  { title: '安装角度与工作距离', slug: 'mounting-guide', tag: '安装' },
  { title: 'IDMVS 客户端快速上手', slug: 'idmvs-quickstart', tag: '软件' },
  { title: '固定式读码器选型方法', slug: 'fixed-reader-selection', tag: '选型' }
]

function openSearch(word = '') {
  window.dispatchEvent(new CustomEvent('kb:search', { detail: word }))
}
</script>

<template>
  <div class="home">
    <section class="hero">
      <div class="page-wrap hero-inner">
        <div class="hero-copy">
          <h1>读码器知识中心<span>.</span></h1>
          <p class="hero-lead">
            固定式读码器、手持巴枪与 PDA 的选型、安装、调试、通讯与排障。让每一台设备
            <strong>读得准、接得快、跑得稳</strong>。
          </p>

          <button class="hero-search" type="button" @click="openSearch()">
            <Icon name="search" :size="18" />
            <span>搜索型号、故障现象或参数…</span>
            <kbd>⌘K</kbd>
          </button>

          <div class="hero-hots">
            <span>热门：</span>
            <button v-for="word in ['触发方式', '读不到码', 'TCP 通讯', 'DPM']" :key="word" type="button" @click="openSearch(word)">
              {{ word }}
            </button>
          </div>

          <div class="hero-stats">
            <div>
              <strong>{{ stats.categories }}</strong>
              <span>知识栏目</span>
            </div>
            <div>
              <strong>{{ stats.articles }}</strong>
              <span>示例文档</span>
            </div>
            <div>
              <strong>{{ stats.series }}</strong>
              <span>终端类型</span>
            </div>
          </div>
        </div>

        <div class="hero-visual">
          <div class="visual-caption">
            <span>FIXED MOUNT</span>
            <b>ID2000</b>
          </div>
          <div class="visual-stage">
            <div class="scan-line" />
            <img :src="id2020" alt="海康机器人 ID2000 系列固定式读码器" />
            <span class="corner tl" /><span class="corner tr" /><span class="corner bl" /><span class="corner br" />
          </div>
          <div class="spec-chips">
            <span><b>1920×1080</b> 分辨率</span>
            <span><b>5 mm</b> 镜头</span>
            <span><b>80 码/秒</b> 读码</span>
          </div>
          <div class="visual-note">MV-ID2020 系列 · 示例参数</div>
        </div>
      </div>
    </section>

    <div class="page-wrap home-body">
      <section class="quick-paths" aria-labelledby="quick-paths-title">
        <h2 id="quick-paths-title" class="sr-only">快速入口</h2>
        <RouterLink v-for="path in quickPaths" :key="path.title" :to="path.to" class="quick-card">
          <div class="quick-head">
            <span class="quick-icon"><Icon :name="path.icon" :size="20" /></span>
            <h3>{{ path.title }}</h3>
          </div>
          <p>{{ path.desc }}</p>
          <span class="quick-link">{{ path.label }} <Icon name="arrowRight" :size="13" /></span>
        </RouterLink>
      </section>

      <section class="category-section">
        <div class="section-head">
          <div>
            <h2>按栏目查找</h2>
            <p>七条主线，从产品到现场，再到系统集成。</p>
          </div>
          <button class="section-link" type="button" @click="openSearch()">
            全文搜索 <Icon name="search" :size="12" />
          </button>
        </div>

        <div class="category-grid">
          <RouterLink v-for="category in categoryCards" :key="category.id" :to="`/category/${category.id}`" class="category-card">
            <div class="card-top">
              <span class="card-icon"><Icon :name="category.icon" :size="20" /></span>
              <h3>{{ category.title }}</h3>
            </div>
            <p>{{ category.description }}</p>
            <div class="card-foot">
              <span class="card-count">{{ category.count }} 篇</span>
              <span class="card-arrow"><Icon name="arrowRight" :size="13" /></span>
            </div>
          </RouterLink>
        </div>
      </section>

      <section class="product-strip">
        <div class="product-copy">
          <h2>ID2000 系列：紧凑型工业读码器</h2>
          <p>
            小体积、嵌入式安装，适合自动化机台与狭小工位。先确认工作距离和视野，再用曝光、增益与码制参数把稳定性拉满。
          </p>
          <div class="product-actions">
            <RouterLink to="/article/id2000-series" class="btn btn-primary">
              查看快速上手 <Icon name="arrowRight" :size="13" />
            </RouterLink>
            <RouterLink to="/category/selection" class="btn btn-ghost">对比其他系列</RouterLink>
          </div>
        </div>
        <div class="product-specs">
          <div><span>分辨率</span><strong>1920 × 1080</strong></div>
          <div><span>镜头</span><strong>5 mm</strong></div>
          <div><span>读码速度</span><strong>80 码 / 秒</strong></div>
          <div><span>帧率</span><strong>50 fps</strong></div>
          <p class="specs-note">以上为系列示例参数，选型请以官方规格书为准。</p>
        </div>
      </section>

      <section class="doc-section">
        <div class="recent-block">
          <div class="section-head">
            <div>
              <h2>最近更新</h2>
            </div>
          </div>
          <div class="recent-list">
            <RouterLink v-for="article in recentArticles" :key="article.slug" :to="`/article/${article.slug}`" class="recent-item">
              <span class="recent-date">{{ article.updated.slice(5) }}</span>
              <span class="recent-main">
                <span class="recent-title">{{ article.title }}</span>
                <span class="recent-meta">{{ article.category?.title }} · {{ article.readTime }} 分钟</span>
              </span>
              <Icon name="arrowRight" :size="13" class="recent-arrow" />
            </RouterLink>
          </div>
        </div>

        <div class="hot-block">
          <div class="section-head">
            <div>
              <h2>高频问题</h2>
            </div>
          </div>
          <div class="hot-list">
            <RouterLink v-for="(doc, index) in hotDocs" :key="doc.slug" :to="`/article/${doc.slug}`" class="hot-item">
              <span class="hot-index">{{ String(index + 1).padStart(2, '0') }}</span>
              <span>{{ doc.title }}</span>
              <b>{{ doc.tag }}</b>
            </RouterLink>
          </div>
          <RouterLink to="/category/troubleshooting" class="hot-more">
            查看全部故障排查 <Icon name="arrowRight" :size="13" />
          </RouterLink>
        </div>
      </section>

      <section class="support-banner">
        <div>
          <h2>文档之外，还有官方支持</h2>
          <p>软件、固件、手册与选型工具，以海康机器人下载中心的最新版本为准。</p>
        </div>
        <div class="support-actions">
          <a class="btn btn-primary" href="https://www.hikrobotics.com/cn/machinevision/service/download?module=0" target="_blank" rel="noopener">
            前往下载中心 <Icon name="external" :size="13" />
          </a>
          <a class="btn btn-ghost" href="https://www.v-club.com/home?primaryType=MACHINE_VISION" target="_blank" rel="noopener">
            访问 V 社区 <Icon name="external" :size="13" />
          </a>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.home {
  background: #f2f5f9;
}

/* ---------- hero ---------- */
.hero {
  position: relative;
  overflow: hidden;
  color: #dbe9f8;
  background: linear-gradient(135deg, #07111f 0%, #0a1c31 55%, #071624 100%);
  border-bottom: 1px solid #173857;
}

.hero-inner {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(320px, 0.8fr);
  gap: 50px;
  align-items: center;
  min-height: 500px;
  padding-top: 64px;
  padding-bottom: 64px;
}

.hero h1 {
  margin: 0 0 17px;
  font-size: clamp(38px, 4.4vw, 58px);
  line-height: 1.06;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #f6faff;
}

.hero :focus-visible {
  outline-color: #7cc4ff;
}

.hero h1 span {
  color: #ff7a1a;
}

.hero-lead {
  max-width: 540px;
  font-size: 15.5px;
  line-height: 1.85;
  color: #a7bdd4;
}

.hero-lead strong {
  color: #e2eefb;
  font-weight: 600;
}

.hero-search {
  display: flex;
  align-items: center;
  gap: 12px;
  width: min(100%, 500px);
  height: 52px;
  margin-top: 28px;
  padding: 0 14px 0 17px;
  color: #a7bdd4;
  text-align: left;
  background: rgba(255, 255, 255, 0.055);
  border: 1px solid rgba(105, 165, 225, 0.4);
  border-radius: 4px;
  cursor: pointer;
  transition: border-color 0.18s ease, background 0.18s ease;
}

.hero-search:hover {
  border-color: #4aa8ff;
  background: rgba(47, 155, 255, 0.1);
}

.hero-search span {
  flex: 1;
  font-size: 15px;
}

.hero-search kbd {
  padding: 3px 8px;
  font-family: var(--font-mono);
  font-size: 11px;
  color: #b8cfe5;
  border: 1px solid rgba(140, 180, 220, 0.36);
  border-radius: 2px;
}

.hero-hots {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 7px;
  margin-top: 14px;
  font-size: 12.5px;
  color: #8fa6bd;
}

.hero-hots button {
  padding: 4px 9px;
  font-size: 12.5px;
  color: #c3d6ea;
  background: transparent;
  border: 1px solid rgba(105, 165, 225, 0.28);
  border-radius: 2px;
  cursor: pointer;
}

.hero-hots button:hover {
  color: #fff;
  border-color: rgba(105, 165, 225, 0.6);
}

.hero-stats {
  display: flex;
  gap: 40px;
  margin-top: 36px;
  padding-top: 22px;
  border-top: 1px solid rgba(112, 160, 214, 0.18);
}

.hero-stats div {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.hero-stats strong {
  font-family: var(--font-mono);
  font-size: 23px;
  font-weight: 700;
  color: #eaf4ff;
  font-variant-numeric: tabular-nums;
}

.hero-stats span {
  font-size: 12px;
  color: #9db4cc;
}

/* ---------- hero visual ---------- */
.hero-visual {
  position: relative;
  padding: 10px 0;
}

.visual-caption {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 4px 10px;
  font-size: 11.5px;
  color: #8fa6bd;
  border-bottom: 1px solid rgba(112, 160, 214, 0.18);
}

.visual-caption b {
  font-family: var(--font-mono);
  font-size: 12px;
  color: #b8cfe5;
  letter-spacing: 0.06em;
}

.visual-stage {
  position: relative;
  display: grid;
  place-items: center;
  height: 300px;
  margin-top: 8px;
}

.visual-stage::before {
  content: '';
  position: absolute;
  inset: 22px;
  background: rgba(47, 155, 255, 0.035);
  border: 1px solid rgba(64, 130, 195, 0.22);
  clip-path: polygon(0 0, 100% 0, 100% 76%, 88% 100%, 0 100%);
}

.visual-stage img {
  position: relative;
  z-index: 2;
  width: 220px;
  filter: drop-shadow(0 22px 34px rgba(0, 8, 18, 0.65));
  transition: transform 0.35s ease;
}

.hero-visual:hover .visual-stage img {
  transform: translateY(-4px) scale(1.015);
}

.scan-line {
  position: absolute;
  z-index: 3;
  width: 214px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #42a5ff, transparent);
  box-shadow: 0 0 18px rgba(66, 165, 255, 0.8);
  animation: productScan 3.6s ease-in-out infinite;
}

@keyframes productScan {
  0%,
  100% {
    transform: translateY(-74px);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  50% {
    transform: translateY(74px);
    opacity: 0.9;
  }
  90% {
    opacity: 0;
  }
}

.corner {
  position: absolute;
  z-index: 4;
  width: 12px;
  height: 12px;
  border-color: #42a5ff;
  border-style: solid;
}

.corner.tl {
  left: 26px;
  top: 26px;
  border-width: 1px 0 0 1px;
}

.corner.tr {
  right: 26px;
  top: 26px;
  border-width: 1px 1px 0 0;
}

.corner.bl {
  left: 26px;
  bottom: 26px;
  border-width: 0 0 1px 1px;
}

.corner.br {
  right: 26px;
  bottom: 26px;
  border-width: 0 1px 1px 0;
}

.spec-chips {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  margin-top: 12px;
}

.spec-chips span {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 9px 10px;
  font-size: 12px;
  color: #a7bdd4;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(112, 160, 214, 0.18);
}

.spec-chips b {
  font-family: var(--font-mono);
  font-size: 13px;
  color: #d5e6f7;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.visual-note {
  margin-top: 9px;
  font-size: 11.5px;
  color: #8fa6bd;
  text-align: right;
}

/* ---------- body ---------- */
.home-body {
  padding-top: 36px;
  padding-bottom: 20px;
}

.quick-paths {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-top: -66px;
  margin-bottom: 46px;
  position: relative;
  z-index: 5;
}

.quick-card {
  display: flex;
  flex-direction: column;
  gap: 11px;
  padding: 22px 22px 19px;
  text-decoration: none;
  background: #fff;
  border: 1px solid #dce6f1;
  border-top: 2px solid #2f9bff;
  border-radius: 3px;
  box-shadow: var(--shadow-md);
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.quick-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 16px 36px rgba(15, 40, 70, 0.13);
}

.quick-card:nth-child(2) {
  border-top-color: #ff7a1a;
}

.quick-card:nth-child(3) {
  border-top-color: #16a37a;
}

.quick-head {
  display: flex;
  align-items: center;
  gap: 10px;
}

.quick-icon {
  display: grid;
  place-items: center;
  color: #0b63bd;
  flex: none;
}

.quick-card:nth-child(2) .quick-icon {
  color: #b45309;
}

.quick-card:nth-child(3) .quick-icon {
  color: #0f7a5c;
}

.quick-card h3 {
  font-size: 16.5px;
  font-weight: 700;
  color: #142a42;
}

.quick-card p {
  font-size: 14px;
  line-height: 1.7;
  color: var(--muted);
}

.quick-link {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: auto;
  padding-top: 4px;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--muted-2);
}

/* ---------- category grid ---------- */
.category-section {
  margin-bottom: 50px;
}

.section-link {
  background: transparent;
  border: 0;
  cursor: pointer;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.category-card {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 190px;
  padding: 20px 19px 16px;
  text-decoration: none;
  background: #fff;
  border: 1px solid #dce6f1;
  border-radius: 3px;
  transition: border-color 0.18s ease, transform 0.18s ease, box-shadow 0.18s ease;
}

.category-card:hover {
  border-color: #9fcdf7;
  box-shadow: 0 12px 28px rgba(15, 40, 70, 0.08);
  transform: translateY(-2px);
}

.card-top {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-bottom: 11px;
}

.card-icon {
  display: grid;
  place-items: center;
  color: #0b63bd;
  flex: none;
}

.category-card h3 {
  font-size: 16px;
  font-weight: 700;
  color: #142a42;
}

.category-card p {
  flex: 1;
  font-size: 14px;
  line-height: 1.7;
  color: var(--muted);
}

.card-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
  padding-top: 11px;
  border-top: 1px dashed #e4edf6;
}

.card-count {
  font-size: 12px;
  color: var(--muted-2);
  font-variant-numeric: tabular-nums;
}

.card-arrow {
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  color: #5b7188;
  border: 1px solid #e0e9f2;
  border-radius: 50%;
  transition: color 0.18s ease, background 0.18s ease, border-color 0.18s ease;
}

.category-card:hover .card-arrow {
  color: #fff;
  background: #0b63bd;
  border-color: #0b63bd;
}

/* ---------- product strip ---------- */
.product-strip {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 40px;
  margin-bottom: 50px;
  padding: 34px 38px;
  background: #fff;
  border: 1px solid #dce6f1;
  border-top: 3px solid #ff7a1a;
  border-radius: 0;
}

.product-copy h2 {
  margin: 0 0 10px;
  font-size: 22px;
  font-weight: 700;
  color: #122238;
}

.product-copy p {
  max-width: 480px;
  font-size: 14.5px;
  line-height: 1.8;
  color: var(--muted);
}

.product-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 18px;
}

.product-specs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1px;
  align-self: center;
  background: #dfe8f2;
  border: 1px solid #dfe8f2;
}

.product-specs div {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 13px 14px;
  background: #fbfdff;
}

.product-specs span {
  font-size: 12px;
  color: var(--muted);
}

.product-specs strong {
  font-family: var(--font-mono);
  font-size: 14px;
  font-weight: 600;
  color: #1b3a57;
  font-variant-numeric: tabular-nums;
}

.specs-note {
  grid-column: 1 / -1;
  padding: 10px 14px;
  font-size: 12px;
  line-height: 1.6;
  color: var(--muted);
  background: #f8fbfe;
}

/* ---------- docs ---------- */
.doc-section {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
  gap: 46px;
  margin-bottom: 50px;
}

.recent-list {
  border-top: 1px solid #dce6f1;
}

.recent-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 14px 6px;
  text-decoration: none;
  border-bottom: 1px dashed #e0e9f2;
  transition: background 0.16s ease;
}

.recent-item:hover {
  background: #f8fbfe;
}

.recent-date {
  width: 44px;
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--muted-2);
  flex: none;
  font-variant-numeric: tabular-nums;
}

.recent-main {
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
  gap: 3px;
}

.recent-title {
  overflow: hidden;
  font-size: 14.5px;
  font-weight: 600;
  color: #273f58;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.recent-meta {
  font-size: 12.5px;
  color: var(--muted);
}

.recent-arrow {
  color: #8199af;
}

.recent-item:hover .recent-title {
  color: #0b63bd;
}

.recent-item:hover .recent-arrow {
  color: #0b63bd;
}

.hot-list {
  border-top: 1px solid #dce6f1;
}

.hot-item {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 13px 6px;
  text-decoration: none;
  border-bottom: 1px dashed #e0e9f2;
}

.hot-item:hover {
  background: #f8fbfe;
}

.hot-index {
  font-family: var(--font-mono);
  font-size: 12px;
  color: #a34b0a;
  font-variant-numeric: tabular-nums;
}

.hot-item span:nth-child(2) {
  flex: 1;
  font-size: 14px;
  color: #31465e;
}

.hot-item b {
  font-size: 12px;
  font-weight: 400;
  color: var(--muted);
}

.hot-item:hover span:nth-child(2) {
  color: #0b63bd;
}

.hot-more {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-top: 15px;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--muted-2);
  text-decoration: none;
}

.hot-more:hover {
  color: #0b63bd;
}

/* ---------- support banner ---------- */
.support-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
  padding: 28px 34px;
  color: #dbe9f8;
  background: #0a1b2e;
  border: 1px solid #1b3a5c;
  border-radius: 3px;
}

.support-banner h2 {
  margin: 0 0 6px;
  font-size: 20px;
  color: #f1f7ff;
}

.support-banner p {
  font-size: 14px;
  line-height: 1.7;
  color: #a7bdd4;
}

.support-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 9px;
}

.support-banner .btn-primary {
  background: #1173d4;
  border-color: #1173d4;
}

.support-banner .btn-primary:hover {
  background: #0b63bd;
  border-color: #0b63bd;
}

.support-banner .btn-ghost {
  color: #c3d6ea;
  border-color: #3d6488;
}

.support-banner .btn-ghost:hover {
  color: #fff;
  border-color: #5a83a9;
  background: rgba(47, 155, 255, 0.1);
}

@media (max-width: 1024px) {
  .hero-inner {
    grid-template-columns: 1fr;
    gap: 30px;
    padding-top: 52px;
  }
  .hero-visual {
    max-width: 460px;
  }
  .category-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  .doc-section {
    grid-template-columns: minmax(0, 1fr);
    gap: 40px;
  }
}

@media (max-width: 760px) {
  .hero-inner {
    min-height: 0;
    padding-top: 44px;
    padding-bottom: 56px;
  }
  .hero h1 {
    font-size: 38px;
  }
  .hero-stats {
    gap: 26px;
  }
  .quick-paths {
    grid-template-columns: 1fr;
    margin-top: -38px;
  }
  .category-grid {
    grid-template-columns: 1fr 1fr;
  }
  .product-strip {
    grid-template-columns: 1fr;
    gap: 24px;
    padding: 26px 22px;
  }
  .support-banner {
    flex-direction: column;
    align-items: flex-start;
    padding: 24px 22px;
  }
  .hero-visual {
    display: none;
  }
  .visual-stage {
    height: 260px;
  }
  .visual-stage img {
    width: 190px;
  }
}

@media (max-width: 460px) {
  .category-grid {
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }
  .category-card {
    min-height: 0;
    padding: 15px 14px 13px;
  }
  .card-top {
    margin-bottom: 8px;
  }
  .category-card h3 {
    font-size: 14px;
  }
  .category-card p {
    display: -webkit-box;
    overflow: hidden;
    font-size: 12.5px;
    line-height: 1.6;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }
  .hero-stats {
    gap: 20px;
  }
}
</style>
