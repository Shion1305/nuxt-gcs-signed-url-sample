<script lang="ts" setup>
const downloadUrl = ref("");


async function getDownloadUrl() {
  const url = await useFetch("/api/link/download", {
    method: "GET",
  }).then((res) => {
    if (!res.data.value) {
      console.error("download url is empty")
      return;
    }
    downloadUrl.value = res.data.value;
    return res.data.value
  }) as string;
  console.log("url", url);
  return url;
}


async function download() {
  const targetUrl = await getDownloadUrl();
  const resp = await fetch(targetUrl, {
    method: "GET",
    headers: {
      'x-goog-meta-username': 'shion1305',
    },
    mode: "cors",
  });
  const blob = await resp.blob();
  const downloadUrl = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = downloadUrl;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(downloadUrl);
  console.log("download", resp);
}
</script>

<template>
  <section>
    <h2>Download from /test</h2>
    <button @click="download">ダウンロード</button>
    {{ downloadUrl }}
  </section>
</template>

<style scoped></style>
