<script setup>
import Icon from './Icon.vue'
</script>

<template>
  <footer class="site-footer">
    <div class="footer-grid">
      <div class="footer-brand">
        <span class="footer-logo">
          <span class="footer-bars"><i v-for="n in 4" :key="n" /></span>
          HIKROBOT <b>KB</b>
        </span>
        <p>面向固定式读码器、手持巴枪与 PDA 场景的读码知识库。把选型、部署、通讯和排障放在同一个入口。</p>
        <span class="footer-tag">示例知识库 · 非官方站点</span>
      </div>

      <div class="footer-col">
        <h3>知识栏目</h3>
        <RouterLink to="/category/selection">产品与选型</RouterLink>
        <RouterLink to="/category/installation">安装与光学</RouterLink>
        <RouterLink to="/category/software">调试与软件</RouterLink>
        <RouterLink to="/category/communication">通讯与协议</RouterLink>
        <RouterLink to="/category/development">二次开发</RouterLink>
        <RouterLink to="/category/troubleshooting">故障排查</RouterLink>
      </div>

      <div class="footer-col">
        <h3>官方资源</h3>
        <a href="https://www.hikrobotics.com/cn/machinevision/visionproduct/?typeId=189" target="_blank" rel="noopener">
          读码器产品页 <Icon name="external" :size="11" />
        </a>
        <a href="https://www.hikrobotics.com/cn/machinevision/service/download?module=0" target="_blank" rel="noopener">
          下载中心 <Icon name="external" :size="11" />
        </a>
        <a href="https://www.v-club.com/home?primaryType=MACHINE_VISION" target="_blank" rel="noopener">
          V 社区 <Icon name="external" :size="11" />
        </a>
        <a href="https://www.hikrobotics.com/cn/machinevision/service/aftersale/guarantee" target="_blank" rel="noopener">
          售后服务 <Icon name="external" :size="11" />
        </a>
      </div>
    </div>

    <div class="footer-bottom">
      <span>© 2026 读码器知识中心 · 演示项目</span>
      <span class="footer-disclaimer">
        本站为示例知识库，非海康机器人官方站点；产品参数、软件与操作请以官方手册和最新固件为准。
      </span>
      <span class="footer-build">Vue 3 · Vite · GitHub Pages</span>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  margin-top: 56px;
  color: #a7bdd4;
  background: #07111f;
  border-top: 1px solid #1b3350;
}

.footer-grid {
  display: grid;
  grid-template-columns: 1.5fr 0.8fr 0.8fr;
  gap: 44px;
  max-width: 1180px;
  margin: 0 auto;
  padding: 46px 40px 34px;
}

.footer-brand p {
  max-width: 390px;
  margin: 14px 0 16px;
  font-size: 14px;
  line-height: 1.8;
  color: #a7bdd4;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #e2eefb;
}

.footer-logo b {
  color: #6cbcff;
}

.footer-bars {
  display: flex;
  align-items: flex-end;
  gap: 2px;
  height: 18px;
  padding: 0 3px;
  border: 1px solid rgba(120, 180, 240, 0.3);
}

.footer-bars i {
  display: block;
  width: 2px;
  height: 7px;
  background: #42a5ff;
}

.footer-bars i:nth-child(2) {
  height: 11px;
}

.footer-bars i:nth-child(3) {
  height: 8px;
  background: #ff7a1a;
}

.footer-bars i:nth-child(4) {
  height: 13px;
}

.footer-tag {
  display: inline-block;
  padding: 5px 9px;
  font-size: 12px;
  color: #a7bdd4;
  border: 1px solid #2a4663;
  border-radius: 2px;
}

.footer-col {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.footer-col h3 {
  margin: 2px 0 6px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: #8fa6bd;
}

.footer-col a {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 13.5px;
  color: #b4c8de;
  text-decoration: none;
  transition: color 0.16s ease;
}

.footer-col a:hover {
  color: #fff;
}

.footer-bottom {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px 22px;
  padding: 16px 40px;
  font-size: 12px;
  color: #8fa6bd;
  border-top: 1px solid #132941;
}

.footer-disclaimer {
  flex: 1;
  min-width: 0;
}

.footer-build {
  font-family: 'SFMono-Regular', Menlo, Consolas, monospace;
  font-size: 11.5px;
  letter-spacing: 0.02em;
  color: #8fa6bd;
}

@media (max-width: 860px) {
  .footer-grid {
    grid-template-columns: 1fr 1fr;
    gap: 30px;
    padding: 34px 24px 24px;
  }
  .footer-brand {
    grid-column: 1 / -1;
  }
  .footer-bottom {
    padding: 14px 24px;
  }
}

@media (max-width: 560px) {
  .footer-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
