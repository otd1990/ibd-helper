<script setup lang="ts">
import { ref } from "vue";
import BlogPosts from "./components/blog-posts/BlogPosts.vue";
import SupportCommunities from "./components/support-communities/SupportCommunities.vue";

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
  <section class="hero">
    <h1 class="hero__heading">IBD Helper</h1>
    <h2>Ask our AI expert a question or browse some related blogs below</h2>
    <form @submit.prevent="askQuestion" class="hero__form">
      <label for="prompt">Ask Your Question:</label>
      <div class="form__control">
        <input
          type="text"
          v-model="question"
          placeholder="What can I substitute for garlic in a bolognese"
        />
        <button type="submit">Ask</button>
      </div>
    </form>
    <div v-if="response">
      <h2>Answer:</h2>
      <p>{{ response }}</p>
    </div>
  </section>
  <section class="blogs">
    <BlogPosts />
  </section>
  <section class="communities">
    <SupportCommunities />
  </section>
</template>

<style>
.hero {
  background: linear-gradient(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.35)),
    url("https://media.istockphoto.com/id/1413654414/photo/layout-of-intestine-model-and-products-to-help-digestion-on-grey-table-top-view.jpg?s=2048x2048&w=is&k=20&c=CkMqHuS_V7yS9YZu1d-W149chCPLjPkuJWKSJnX9YZs="),
    center, no-repeat;
  height: 50dvh;
  width: 100%;
  background-position: center;
  background-repeat: no-repeat;
  color: #fff;
  border-radius: 0.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .hero__heading {
    color: #fff;
  }

  label {
    text-align: left;
    width: 64%;
    left: 0;
    right: 0;
    position: relative;
    margin: 0 auto;
    text-align: left;
    display: block;
  }

  input {
    padding: 1rem;
    border-radius: 0.25rem;
    border: 0;
    margin-right: 0.25rem;
    max-height: 48px;
    width: 80%;
    text-align: left;
  }

  h1,
  h2 {
    margin: 0 0 1rem 0;
    color: #f7f7f7;
  }

  h2 {
    font-weight: 400;
  }

  .hero__form {
    width: 100%;
  }
}

.form__control {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
  width: 70%;
  margin: 0 auto;
}
</style>
