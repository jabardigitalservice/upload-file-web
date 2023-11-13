<template>
  <div class="mt-14">
    <DragAndDropFile
      ref="BaseDragAndDropFile"
      label="Upload File :"
      sublabel="Tipe File JPG/JPEG/PNG dengan maksimal ukuran file 10 MB"
      height-drag-and-drop="h-[350px]"
      :detail-drag-and-drop="detailDragAndDrop"
      @upload-file="uploadFile"
    />

    <div v-if="state.url">
      url: {{ state.url }}
      <div>
        <button @click="onClick">Copy to clipboard</button>
      </div>
    </div>

    <ViewFileModal
      :show="dataImage.showDialog"
      :file="dataImage.fileId"
      :mime-type="dataImage.mimeType"
      @close="dataImage.showDialog = false"
    />
  </div>
</template>

<script setup>
// import { useDataImage } from "@/store/index";

const runtimeConfig = useRuntimeConfig();
const state = reactive({
  url: "",
});

const onClick = async (e) => {
  e.preventDefault();
  navigator.clipboard.writeText(state.url);
  alert("Your link has been copied to clipboard ");
};

const detailDragAndDrop = ref({
  informationSizeCompatible:
    "Ukuran file dokumen SK tidak boleh melebihi 10 MB.",
  informationFormatCompatible:
    "Hanya file yang berformat JPG/JPEG/PNG yang dapat diupload.",
  formatTypeFile: ["image/jpeg", "image/png", "image/jpg"],
  maxSizeFile: 10485760 ,
  acceptFile: ".jpg,.jpeg,.png",
});

const dataImage = ref({
  showDialog: false,
  fileId: "",
  mimeType: "",
});

const uploadFile = async (value) => {
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
    state.url = data.value.data.url;
  } catch (error) {
    console.log(error);
  }
};
</script>
