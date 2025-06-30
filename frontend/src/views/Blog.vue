<template>
  <div class="blog-list">
    <h1 class="blog-title">Blog</h1>
    <div class="blog-search-bar">
      <input
        v-model="search"
        type="text"
        placeholder="Search blogs..."
        class="blog-search-input"
      />
    </div>
    <div class="blog-grid">
      <router-link
        v-for="post in filteredPosts"
        :key="post.id"
        :to="`/blog/${post.id}`"
        class="blog-card blog-link"
      >
        <div class="blog-card-title">{{ post.title }}</div>
        <div class="blog-card-date">{{ post.date }}</div>
        <div class="blog-card-html" v-html="post.html"></div>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import fm from 'front-matter'
import { marked } from 'marked'

// 自动扫描 public/blog 下所有 md 文件
const blogFiles = Object.keys(
  import.meta.glob('/public/blog/*.md', { eager: false })
).map(path => path.replace('/public/blog/', ''))

const posts = ref([])
const search = ref('')

async function loadBlogHtml(filename) {
  const res = await fetch(`/blog/${filename}`)
  const text = await res.text()
  const { attributes, body } = fm(text)
  // 只取前2段正文
  const paragraphs = body.split('\n').filter(line => line.trim()).slice(0, 2).join('\n\n')
  return {
    id: filename.replace(/\.md$/, ''),
    title: attributes.title || filename,
    date: attributes.date || '',
    html: marked.parse(paragraphs)
  }
}

const filteredPosts = computed(() =>
  posts.value.filter(post =>
    post.title.toLowerCase().includes(search.value.toLowerCase()) ||
    post.html.toLowerCase().includes(search.value.toLowerCase())
  )
)

onMounted(async () => {
  const metas = await Promise.all(blogFiles.map(loadBlogHtml))
  posts.value = metas.sort((a, b) => b.date.localeCompare(a.date))
})
</script>

<style scoped>
.blog-list {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem 1rem;
}
.blog-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 2.5rem;
  color: #ffd700;
  letter-spacing: 0.05em;
  text-shadow: 0 2px 12px #ffd70033;
}
.blog-search-bar {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}
.blog-search-input {
  width: 320px;
  padding: 0.7rem 1.2rem;
  border: 2px solid #ffd700;
  border-radius: 22px;
  font-size: 1.1rem;
  outline: none;
  background: rgba(10,10,30,0.95);
  color: #ffd700;
  box-shadow: 0 2px 12px #ffd70022;
  transition: border-color 0.2s;
}
.blog-search-input:focus {
  border-color: #fffbe6;
}
.blog-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
}
.blog-card {
  background: rgba(10, 10, 30, 0.97);
  border: 2px solid #ffd700;
  border-radius: 18px;
  box-shadow: 0 4px 24px #ffd70022, 0 1px 4px #0008;
  width: 340px;
  min-height: 220px;
  padding: 1.2rem 1.2rem 1.5rem 1.2rem;
  transition: transform 0.18s, box-shadow 0.18s;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
}
.blog-card:hover {
  transform: translateY(-6px) scale(1.03);
  box-shadow: 0 12px 40px #ffd70055, 0 4px 16px #fffbe688;
  border-color: #fffbe6;
}
.blog-card-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #ffd700;
  margin-bottom: 0.5rem;
  text-shadow: 0 1px 8px #ffd70033;
  line-height: 1.2;
}
.blog-card-date {
  font-size: 0.95rem;
  color: #aaa;
  margin-bottom: 1rem;
}
.blog-card-html {
  font-size: 1.08rem;
  color: #f5e9b8;
  line-height: 1.6;
  margin-bottom: 0.5rem;
  min-height: 3.2em;
}
@media (max-width: 800px) {
  .blog-grid { flex-direction: column; align-items: center; }
  .blog-card { width: 98vw; max-width: 400px; }
}
</style> 