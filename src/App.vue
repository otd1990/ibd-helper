<script setup lang="ts">
import { ref } from "vue";
import BlogPosts from "./components/helpful-content/blog-posts/BlogPosts.vue";

const question = ref("");
const response = ref("");

const askQuestion = async () => {
  try {
    const res = await fetch("http://localhost:3010/api/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: question.value }),
    });

    const data = await res.json();

    response.value = data.reply;
  } catch (error) {
    console.error("Error asking question ", error);
  }
};
</script>

<template>
  <section>
    <h1>IBD Helper</h1>
    <form @submit.prevent="askQuestion">
      <label for="prompt">Ask Your Question:</label>
      <input
        type="text"
        v-model="question"
        placeholder="What can I substitute for garlic in a bolognese"
      />
      <button type="submit">Ask</button>
    </form>
    <div v-if="response">
      <h2>Answer:</h2>
      <p>{{ response }}</p>
    </div>
  </section>
  <section class="blogs">
    <BlogPosts />
  </section>
</template>
