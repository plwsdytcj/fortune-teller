<script setup>
import { NCard } from 'naive-ui';
import MarkdownIt from 'markdown-it';
import { ABOUT } from "../config/constants";

const md = new MarkdownIt();
const about = md.render(ABOUT);
</script>

<template>
  <div class="about-container">
    <n-card class="mystical-about-card">
      <div class="about-header">
        <div class="header-ornament">◆ ◇ ◆</div>
        <h2 class="about-title">About Fortune Telling</h2>
        <div class="header-ornament">◆ ◇ ◆</div>
      </div>
      <div class="about-content" v-html="about"></div>
    </n-card>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.about-container {
  padding: 1rem;
}

.mystical-about-card {
  background: rgba(0, 0, 0, 0.4) !important;
  border: 1px solid rgba(212, 175, 55, 0.3) !important;
  backdrop-filter: blur(15px);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(212, 175, 55, 0.15);
}

.about-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(212, 175, 55, 0.2);
}

.header-ornament {
  color: #d4af37;
  font-size: 1.2rem;
  opacity: 0.8;
}

.about-title {
  font-family: 'Inter', sans-serif;
  font-size: 1.8rem;
  font-weight: 700;
  background: linear-gradient(45deg, #d4af37, #ffd700);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  text-shadow: 0 0 10px rgba(212, 175, 55, 0.3);
}

.about-content {
  text-align: left;
  color: rgba(212, 175, 55, 0.9);
  line-height: 1.8;
  font-family: 'Inter', sans-serif;
}

.about-content :deep(h1) {
  color: #ffd700;
  font-family: 'Inter', sans-serif;
  font-size: 1.6rem;
  font-weight: 700;
  margin: 2rem 0 1rem 0;
  text-align: center;
  border-bottom: 1px solid rgba(212, 175, 55, 0.2);
  padding-bottom: 0.5rem;
}

.about-content :deep(h2) {
  color: #d4af37;
  font-family: 'Inter', sans-serif;
  font-size: 1.4rem;
  font-weight: 600;
  margin: 1.5rem 0 1rem 0;
  position: relative;
}

.about-content :deep(h2::before) {
  content: "◆";
  color: rgba(212, 175, 55, 0.6);
  margin-right: 0.5rem;
}

.about-content :deep(p) {
  margin-bottom: 1rem;
  text-indent: 2em;
}

.about-content :deep(strong) {
  color: #ffd700;
  font-weight: 600;
}

.about-content :deep(ul) {
  margin: 1rem 0;
  padding-left: 2rem;
}

.about-content :deep(li) {
  margin-bottom: 0.5rem;
  position: relative;
}

.about-content :deep(li::marker) {
  color: #d4af37;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .about-title {
    font-size: 1.5rem;
  }
  
  .header-ornament {
    font-size: 1rem;
  }
  
  .about-content :deep(h1) {
    font-size: 1.4rem;
  }
  
  .about-content :deep(h2) {
    font-size: 1.2rem;
  }
}
</style>