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

    <div class="flex items-center justify-center mt-5" v-if="state.url">
      <div
        class="text-sm sm:text-base inline-flex text-left items-center space-x-4 bg-gray-800 text-white rounded-lg p-4 pl-6"
      >
        <span class="flex gap-4">
          <span class="flex-1">
            <span> {{ state.url }} </span>
          </span>
        </span>

        <button
          @click="copyToClipboard()"
          class="flex flex-col items-center justify-center h-auto px-3 w-16 pt-2 font-medium pb-1.5 text-[0.65rem] uppercase rounded-md cursor-pointer text-neutral-400 group"
        >
          <svg
            v-show="!copyNotification"
            class="flex-shrink-0 w-5 h-5 mb-1 stroke-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
            />
          </svg>
          <span v-show="!copyNotification">Copy</span>
          <svg
            v-show="copyNotification"
            class="flex-shrink-0 w-5 h-5 mb-1 text-green-500 stroke-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            x-cloak
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75"
            />
          </svg>
          <span
            v-show="copyNotification"
            class="tracking-tight text-green-500"
            x-cloak
            >Copied</span
          >
        </button>
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
const runtimeConfig = useRuntimeConfig();
const state = reactive({
  url: "",
});

const copyNotification = ref(false);

const detailDragAndDrop = ref({
  informationSizeCompatible:
    "Ukuran file dokumen SK tidak boleh melebihi 10 MB.",
  informationFormatCompatible:
    "Hanya file yang berformat JPG/JPEG/PNG yang dapat diupload.",
  formatTypeFile: ["image/jpeg", "image/png", "image/jpg"],
  maxSizeFile: 10485760,
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

const copyToClipboard = () => {
  copyNotification.value = true;
  navigator.clipboard.writeText(state.url);
  setTimeout(function () {
    copyNotification.value = false;
  }, 3000);
};
</script>
