<script lang="ts" setup>
const files = ref<FileList>();
const uploadUrl = ref("");
const downloadUrl = ref("");

function changeFiles(event: Event) {
  const result = event!.target as HTMLInputElement;
  files.value = result.files!;
}

async function getUploadUrl() {
  const url = await useFetch("/api/link/upload", {
    method: "GET",
  }).then((res) => {
    if (!res.data.value) {
      console.error("upload url is empty")
      return;
    }
    uploadUrl.value = res.data.value;
    return res.data.value
  }) as string;
  console.log("url", url);
  return url;
}

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

async function upload() {
  // PUT url
  if (!files.value) {
    return;
  }
  const f = files.value[0];
  const formData = new FormData();
  formData.append("file", f);
  formData.append("title", "test.zip");
  // PUT file
  const uploadUrl = await getUploadUrl();
  const resp = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": f.type,
      //   filename
      "Content-Disposition": "attachment; filename=test.zip",
      "x-goog-meta-username": "shion1305",
    },
    body: formData,
  });
  console.log("upload", resp);
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
  <main>
    <section>
      <h2>Upload to /test</h2>
      {{ uploadUrl }}
      <form @submit.prevent="upload">
        <div>Text field title: <input name="title" type="text"/></div>
        <div>
          File: <input multiple name="files" type="file" @change="changeFiles"/>
        </div>
        <input type="submit" value="アップロード"/>
      </form>
    </section>
    <section>
      <h2>Download from /test</h2>
      <button @click="download">ダウンロード</button>
      {{ downloadUrl }}
    </section>
  </main>
</template>
