<template>
  <div class="consulting-container">
    <div class="consulting-card">
      <h1 class="consulting-title">One-on-One Consulting Session</h1>
      <p class="consulting-desc">
        Want personalized guidance or a private divination session? Book a one-on-one consulting session with our expert!
      </p>
      <ul class="consulting-list">
        <li>🌟 Tarot, astrology, dream interpretation, and more</li>
        <li>🌟 Confidential and tailored to your needs</li>
        <li>🌟 Online (Zoom/WeChat/WhatsApp) or email</li>
      </ul>
      <div class="consulting-contact">
        <p><b>Contact us:</b></p>
        <p>Email: <a href="mailto:your@email.com">your@email.com</a></p>
        <p>WeChat: <b>yourwechatid</b></p>
        <p>WhatsApp: <b>+1234567890</b></p>
      </div>
    </div>
  </div>
</template>

<script setup>
// 可选：表单逻辑
// import { ref } from 'vue'
// const name = ref('')
// const email = ref('')
// const message = ref('')
// function onSubmit() { /* ... */ }
</script>

<style scoped>
.consulting-container {
  max-width: 700px;
  margin: 0 auto;
  padding: 2.5rem 1rem;
}
.consulting-card {
  background: rgba(10, 10, 30, 0.98);
  border: 2.5px solid #ffd700;
  border-radius: 20px;
  box-shadow: 0 8px 32px #ffd70022, 0 2px 8px #0008;
  padding: 2.5rem 2rem;
  margin: 0 auto;
}
.consulting-title {
  font-size: 2rem;
  font-weight: 800;
  color: #ffd700;
  margin-bottom: 1.2rem;
  text-align: center;
  letter-spacing: 0.04em;
  text-shadow: 0 2px 12px #ffd70033;
}
.consulting-desc {
  color: #f5e9b8;
  font-size: 1.15rem;
  margin-bottom: 1.5rem;
  text-align: center;
}
.consulting-list {
  color: #ffd700;
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
}
.consulting-contact {
  color: #f5e9b8;
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
}
.consulting-contact a { color: #ffd700; }
</style> 