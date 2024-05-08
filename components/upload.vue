<script lang="ts" setup>
const uploadUrl = ref("");
const files = ref<FileList | null>(null);

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

</script>

<template>
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
</template>

<style scoped></style>
