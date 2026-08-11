<script setup lang="ts">
import { useData } from "vitepress";
import { computed, ref } from "vue";

const { frontmatter, page } = useData();
const copyState = ref<"idle" | "copied" | "failed">("idle");

const markdown = computed(() => (page.value.frontmatter.rawMarkdown as string | undefined) ?? "");
// biome-ignore lint/correctness/noUnusedVariables: referenced by the Vue template
const visible = computed(() => frontmatter.value.layout !== "home" && markdown.value.length > 0);
// biome-ignore lint/correctness/noUnusedVariables: referenced by the Vue template
const rawPath = computed(() => (frontmatter.value.rawMarkdownPath as string | undefined) ?? "");
const rawUrl = computed(() => (frontmatter.value.rawMarkdownUrl as string | undefined) ?? "");
const pageTitle = computed(() => (frontmatter.value.rawMarkdownTitle as string | undefined) ?? page.value.title);
const aiPrompt = computed(
  () =>
    `Read ${rawUrl.value} and help me with ${pageTitle.value}. ` +
    "Use the linked Curvy documentation as the source of truth and call out anything it does not specify.",
);
// biome-ignore lint/correctness/noUnusedVariables: referenced by the Vue template
const chatGptUrl = computed(() => `https://chatgpt.com/?q=${encodeURIComponent(aiPrompt.value)}`);
// biome-ignore lint/correctness/noUnusedVariables: referenced by the Vue template
const claudeUrl = computed(() => `https://claude.ai/new?q=${encodeURIComponent(aiPrompt.value)}`);

// biome-ignore lint/correctness/noUnusedVariables: referenced by the Vue template
async function copyPage(): Promise<void> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(markdown.value);
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = markdown.value;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      const copied = document.execCommand("copy");
      textarea.remove();
      if (!copied) throw new Error("Copy command failed");
    }
    copyState.value = "copied";
  } catch {
    copyState.value = "failed";
  }
  window.setTimeout(() => {
    copyState.value = "idle";
  }, 2_000);
}
</script>

<template>
  <div v-if="visible" class="page-actions" aria-label="Page actions">
    <button class="page-action" type="button" @click="copyPage">
      <span aria-hidden="true">⧉</span>
      {{ copyState === "copied" ? "Copied" : copyState === "failed" ? "Copy failed" : "Copy page" }}
    </button>
    <details class="ask-ai">
      <summary class="page-action">
        <span aria-hidden="true">✦</span>
        Ask AI
        <span class="chevron" aria-hidden="true">⌄</span>
      </summary>
      <div class="ask-ai-menu">
        <a :href="chatGptUrl" target="_blank" rel="noopener noreferrer">
          <span>Open in ChatGPT</span>
          <span aria-hidden="true">↗</span>
        </a>
        <a :href="claudeUrl" target="_blank" rel="noopener noreferrer">
          <span>Open in Claude</span>
          <span aria-hidden="true">↗</span>
        </a>
        <a :href="rawPath" target="_blank" rel="noopener noreferrer">
          <span>View as Markdown</span>
          <span aria-hidden="true">↗</span>
        </a>
      </div>
    </details>
  </div>
</template>
