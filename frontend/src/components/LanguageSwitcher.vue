<template>
  <div class="language-switcher">
    <select v-model="$i18n.locale" class="themed-select-native">
      <option value="en" class="themed-option">English</option>
      <option value="zh" class="themed-option">中文</option>
    </select>
  </div>
</template>

<script setup>
// 这个组件非常简单，甚至不需要任何 script
</script>

<style scoped>
.language-switcher {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 1000; /* Ensure it's above other content */
}

.themed-select-native {
  background-color: #1A1A1A; /* Very Dark Grey */
  color: #FFD700; /* Gold text */
  border: 1px solid #B8860B; /* DarkGoldenRod border */
  padding: 8px 12px;
  border-radius: 4px;
  font-family: "Georgia", serif;
  font-size: 0.9rem;
  cursor: pointer;
  outline: none; /* Remove default focus outline */
}

.themed-select-native:hover {
  border-color: #FFD700; /* Brighter Gold on hover */
}

.themed-select-native:focus {
  border-color: #FFD700;
  box-shadow: 0 0 5px #FFD700; /* Gold glow on focus */
}

/* Styling options is tricky and browser-dependent, this might not work everywhere */
.themed-option {
  background-color: #1A1A1A;
  color: #E0E0E0;
  font-family: "Helvetica Neue", "Arial", sans-serif; /* Match body font for options */
}

/* Arrow styling - basic attempt, might need ::-ms-expand for IE/Edge */
.themed-select-native {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  /* Custom arrow using background image (SVG recommended for crispness) */
  /* For simplicity, using a Unicode character here, but an SVG would be better */
  background-image: url('data:image/svg+xml;charset=US-ASCII,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="%23FFD700" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/></svg>');
  background-repeat: no-repeat;
  background-position: right 8px center;
  padding-right: 30px; /* Make space for the arrow */
}

</style> 