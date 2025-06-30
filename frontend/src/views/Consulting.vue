<template>
  <div class="consulting-container">
    <div class="consulting-card">
      <h1 class="consulting-title">One-on-One FengShui Consulting Session</h1>
      <p class="consulting-desc">
        Want personalized FengShui guidance for your home, office, or life? Book a one-on-one FengShui consulting session with our expert!
      </p>
      <ul class="consulting-list">
        <li>🌟 FengShui for home, office, and business</li>
        <li>🌟 Personalized energy flow and harmony analysis</li>
        <li>🌟 Practical tips for prosperity, health, and well-being</li>
        <li>🌟 Online (image.png/WeChat/WhatsApp) or email</li>
      </ul>
      <div class="consulting-contact">
        <p><b>Contact us:</b></p>
        <p>Email: <a href="your@email.com">osulcj@email.com</a></p>
        <p>WhatsApp: <b></b></p>
        <div class="whatsapp-qr-section">
          <img
            src="/7101751253769_.pic.jpg"
            alt="WhatsApp QR code for CJ Lin"
            class="whatsapp-qr-img"
          />
          <div class="whatsapp-qr-caption">
            Scan or upload this QR code using the WhatsApp camera to add me on WhatsApp
          </div>
        </div>
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
.whatsapp-qr-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 1.2rem;
}
.whatsapp-qr-img {
  width: 220px;
  max-width: 90vw;
  border-radius: 16px;
  box-shadow: 0 4px 16px #0005;
  margin-bottom: 0.5rem;
}
.whatsapp-qr-caption {
  color: #b2ffb2;
  font-size: 1rem;
  text-align: center;
  margin-bottom: 0.5rem;
}
</style> 