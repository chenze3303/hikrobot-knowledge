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
        <span class="footer-tag">KNOWLEDGE&nbsp;CENTER&nbsp;/&nbsp;SAMPLE&nbsp;BUILD</span>
      </div>

      <div class="footer-col">
        <h4>知识栏目</h4>
        <RouterLink to="/category/selection">产品与选型</RouterLink>
        <RouterLink to="/category/installation">安装与光学</RouterLink>
        <RouterLink to="/category/software">调试与软件</RouterLink>
        <RouterLink to="/category/integration">通讯与集成</RouterLink>
        <RouterLink to="/category/troubleshooting">故障排查</RouterLink>
      </div>

      <div class="footer-col">
        <h4>官方资源</h4>
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
  color: #9db4cc;
  background:
    linear-gradient(rgba(47, 155, 255, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(47, 155, 255, 0.04) 1px, transparent 1px),
    #07111f;
  background-size: 28px 28px;
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
  font-size: 12px;
  line-height: 1.8;
  color: #748ca5;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 9px;
  font-family: 'SFMono-Regular', Menlo, Consolas, monospace;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: #dce9f7;
}

.footer-logo b {
  color: #42a5ff;
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
  padding: 4px 8px;
  font-family: 'SFMono-Regular', Menlo, Consolas, monospace;
  font-size: 8px;
  letter-spacing: 0.12em;
  color: #5f7c9d;
  border: 1px solid #1d3550;
  border-radius: 2px;
}

.footer-col {
  display: flex;
  flex-direction: column;
  gap: 9px;
}

.footer-col h4 {
  margin: 2px 0 6px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.16em;
  color: #7894b0;
}

.footer-col a {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11.5px;
  color: #8fa9c3;
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
  padding: 15px 40px;
  font-size: 9.5px;
  color: #5b7590;
  border-top: 1px solid #132941;
}

.footer-disclaimer {
  flex: 1;
  min-width: 300px;
}

.footer-build {
  font-family: 'SFMono-Regular', Menlo, Consolas, monospace;
  letter-spacing: 0.08em;
  color: #55708c;
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
</style>
