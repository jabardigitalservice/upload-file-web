<template>
  <div class="mt-14">
    <DragAndDropFile
      ref="BaseDragAndDropFile"
      label="Upload File :"
      sublabel="Tipe File JPG/JPEG/PNG dengan maksimal ukuran file 10 MB"
      height-drag-and-drop="h-[350px]"
      :detail-drag-and-drop="detailDragAndDrop"
      @upload-file="uploadFile"
      @reset-url="state.url = ''"
    />

    <div v-if="!state.url && state.loading"
      class="w-12 h-12 rounded-full animate-spin border-4 border-dashed border-green-500 border-t-transparent text-center mx-auto mt-5"
    ></div>

    <CopyToClip v-if="state.url" :url="state.url" />
  </div>
</template>

<script setup>
const runtimeConfig = useRuntimeConfig();
const state = reactive({
  url: "",
  loading: false,
});

const detailDragAndDrop = ref({
  informationSizeCompatible:
    "Ukuran file dokumen SK tidak boleh melebihi 10 MB.",
  informationFormatCompatible:
    "Hanya file yang berformat JPG/JPEG/PNG/SVG yang dapat diupload.",
  formatTypeFile: ["image/jpeg", "image/png", "image/jpg", "image/svg+xml"],
  maxSizeFile: 10485760,
  acceptFile: ".jpg,.jpeg,.png,.svg",
});

const uploadFile = async (value) => {

  state.loading = true;
  const formData = new FormData();
  formData.append("file", value.file);
  formData.append("seconds", value.seconds);
  try {
    const { data } = await useFetch(
      runtimeConfig.public.apiBase + "/v1/upload",
      {
        method: "post",
        body: formData,
      }
    );
    state.url = `<img src="${data.value.data.url}" alt="${value.file.name}">`;
    state.loading = false;
  } catch (error) {
    console.error(error);
  }
};
</script>
