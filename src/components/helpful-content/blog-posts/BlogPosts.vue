<script setup lang="ts">
import { ref, onMounted } from "vue";

// State variables
const blogPosts = ref([]);
const loading = ref(true);
const error = ref("");

// Fetch blog posts function
const fetchBlogPosts = async () => {
  // Check if data is already in sessionStorage
  const storedPosts = sessionStorage.getItem("blogPosts");
  if (storedPosts) {
    blogPosts.value = JSON.parse(storedPosts);
    loading.value = false;
    return;
  }

  try {
    // Fetch the data from your API endpoint
    const response = await fetch("http://localhost:3010/api/blog-posts");
    if (!response.ok) throw new Error("Failed to fetch blog posts");

    const data = await response.json();

    console.log("DATA FROM API ", data);

    blogPosts.value = data;
    // sessionStorage.setItem("blogPosts", JSON.stringify(data)); // Store in sessionStorage
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

// Use the onMounted hook to fetch data when the component mounts
onMounted(() => {
  fetchBlogPosts();
});
</script>

<template>
  <section>
    <h2>Blogs</h2>
    <div v-if="loading">Loading resources...</div>
    <div v-else-if="error">{{ error }}</div>
    <ul v-else>
      <li v-for="post in blogPosts" :key="post.title">
        <img :src="post.image" :alt="post.title" />
        <a :href="post.url" target="_blank">{{ post.title }}</a>
        <p v-html="post.desc"></p>
      </li>
    </ul>
  </section>
</template>
