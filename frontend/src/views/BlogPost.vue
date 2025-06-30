<template>
  <div class="blog-post">
    <div class="blog-post-card">
      <h1 class="blog-post-title">{{ post.title }}</h1>
      <div class="blog-date">{{ post.date }}</div>
      <div class="blog-post-content" v-html="post.content"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import fm from 'front-matter'
import { marked } from 'marked'

const route = useRoute()
const post = ref({ title: '', date: '', content: '' })

onMounted(async () => {
  const filename = route.params.id + '.md'
  const res = await fetch(`/blog/${filename}`)
  const text = await res.text()
  const { attributes, body } = fm(text)
  post.value = {
    title: attributes.title || route.params.id,
    date: attributes.date || '',
    content: marked(body)
  }
})
</script>

<style scoped>
.blog-post {
  max-width: 900px;
  margin: 0 auto;
  padding: 2.5rem 1rem;
}
.blog-post-card {
  background: rgba(10, 10, 30, 0.98);
  border: 2.5px solid #ffd700;
  border-radius: 20px;
  box-shadow: 0 8px 32px #ffd70022, 0 2px 8px #0008;
  padding: 2.5rem 2rem 2.5rem 2rem;
  margin: 0 auto;
}
.blog-post-title {
  font-size: 2.2rem;
  font-weight: 800;
  color: #ffd700;
  margin-bottom: 1.2rem;
  text-align: center;
  letter-spacing: 0.04em;
  text-shadow: 0 2px 12px #ffd70033;
}
.blog-date {
  color: #aaa;
  font-size: 1.05rem;
  margin-bottom: 2.2rem;
  text-align: center;
}
.blog-post-content {
  color: #f5e9b8;
  font-size: 1.15rem;
  line-height: 1.85;
  word-break: break-word;
}
.blog-post-content h1, .blog-post-content h2, .blog-post-content h3 {
  color: #ffd700;
  margin-top: 2.2rem;
  margin-bottom: 1.1rem;
  font-weight: 700;
  text-shadow: 0 1px 8px #ffd70033;
}
.blog-post-content p {
  margin-bottom: 1.2rem;
}
.blog-post-content ul, .blog-post-content ol {
  margin-left: 2rem;
  margin-bottom: 1.2rem;
}
.blog-post-content li {
  margin-bottom: 0.5rem;
}
.blog-post-content a {
  color: #ffd700;
  text-decoration: underline;
}
.blog-post-content pre, .blog-post-content code {
  background: #222;
  color: #ffd700;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 1em;
}
@media (max-width: 600px) {
  .blog-post-card {
    padding: 1.2rem 0.5rem;
  }
  .blog-post-title {
    font-size: 1.3rem;
  }
}
</style> 