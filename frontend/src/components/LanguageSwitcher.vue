<template>
  <div class="language-switcher">
    <select v-model="$i18n.locale">
      <option value="en">English</option>
      <option value="zh">中文</option>
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
  z-index: 1000;
}
</style> 