<script setup lang="ts">
import { ref, onMounted } from "vue";
import { BlogsPost } from "../../types/types";

// State variables
const blogPosts = ref<BlogsPost[]>();
const loading = ref<boolean>(true);
const error = ref<string>("");

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
  } catch (err: unknown) {
    const typedError = err as { errorMessage: string };
    error.value = typedError.errorMessage;
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
  <section class="blogs">
    <h2 class="blogs__title">Related Articles</h2>
    <!-- TODO: Change this to loading component-->
    <div v-if="loading">Loading resources...</div>
    <!-- TODO: Change this to error component -->
    <div v-else-if="error">{{ error }}</div>
    <section v-else class="blog__list">
      <article
        v-for="post in blogPosts"
        :key="post.title"
        class="blog__list-item"
      >
        <a :href="post.url" target="_blank" class="blog__list-link">
          <div class="blog__list-image-container">
            <img :src="post.image" :alt="post.title" class="blog__list-image" />
          </div>
          <section class="blog__list-text">
            <h3 class="blog__list-title">{{ post.title }}</h3>
            <p v-html="post.desc" class="blog__list-content"></p>
          </section>
        </a>
      </article>
    </section>
  </section>
</template>

<style lang="css" src="./blog-posts.css" />

<style>
.blog__list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
}

.blog__list-item {
  flex: 1 0 25%;
  max-width: 480px;
  border-radius: 0.25rem;
  position: relative;
}

.blog__list-link {
  transition: all ease 0.3s;
}

.blog__list-link:hover {
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.15);
}

.blog__list-title {
  font-size: 1.5rem;
  color: #000;
  font-weight: 300;
  margin: 0 0 0.65rem 0;
}

.blog__list-content {
  color: #757d92;
}

.blog__list-text {
  text-align: left;
  font-weight: 300 !important;
}

.blog__list-image-container {
  max-height: 200px;
  overflow: hidden;

  > img {
    object-fit: fill;
    width: 100%;
  }
}

.blogs__title {
  text-align: left;
  font-size: 2rem;
  font-weight: 300;
}
</style>
