<template>
  <div class="px-3 xl:px-0 max-w-3xl mx-auto">
    <div class="font-lato text-gray-800">
      <slot name="header" />
      <div class="flex items-center justify-between">
        <div>
          <label
            for="delete-image-times"
            class="block mb-2 text-sm font-bold text-gray-900"
            >Auto Delete Image :
          </label>
          <select
            v-model="selectedDuration"
            id="delete-image-times"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
          >
            <option
              v-for="option in durationOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </div>

        <div>
          <label
            for="delete-image-times"
            class="block mb-2 text-sm font-bold text-gray-900"
          >
          </label>
          <button
            type="button"
            :disabled="disabledButton"
            :class="{
              'cursor-not-allowed': disabledButton,
              'opacity-50': disabledButton,
            }"
            @click="onUploadFile()"
            class="px-3 py-2 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
          >
            Upload File
          </button>
        </div>
      </div>
      <div class="mt-2 flex w-full items-center justify-center">
        <div
          v-if="fileInputIsChange"
          :class="[
            fileIsCorrect
              ? 'border-green-300 bg-green-50'
              : 'border-red-300 bg-red-50',
            heightDragAndDrop,
          ]"
          class="flex w-full flex-col justify-center rounded-lg border-2 border-dashed px-4"
        >
          <div
            id="image-preview"
            class="max-w-lg p-6 mb-4 rounded-lg items-center mx-auto text-center"
          >
            <img
              v-if="url"
              :src="url"
              class="max-h-48 rounded-lg mx-auto"
              alt="Image preview"
            />
          </div>

          <div class="flex w-full flex-row items-center justify-between">
            <div class="w-[85%]">
              <p
                class="mb-2 truncate font-lato text-[14px] font-normal text-black"
              >
                {{ dataFiles.name }}
              </p>

              <p class="mb-2 font-lato text-[11px] font-normal text-gray-600">
                Ukuran {{ dataFiles.fileSize }}
              </p>

              <p
                v-if="!fileSizeIsCompatible()"
                class="font-lato text-[11px] font-bold text-red-600"
              >
                {{ detailDragAndDrop.informationSizeCompatible }}
              </p>

              <p
                v-if="!formatFileIsCompatible()"
                class="font-lato text-[11px] font-bold text-red-600"
              >
                {{ detailDragAndDrop.informationFormatCompatible }}.
              </p>
            </div>

            <div class="flex flex-row">
              <button class="w-4" @click="resetDataFile">
                <IconSvg
                  class="h-4 w-4 text-red-600"
                  icon="/icons/common/trash.svg"
                  :size="16"
                  fillColor="#CB0000"
                />
              </button>
            </div>
          </div>
        </div>
        <label
          v-else
          :class="heightDragAndDrop"
          for="drag-and-drop-file"
          class="flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-4 hover:bg-gray-200"
          @dragover="dragover"
          @dragleave="dragleave"
          @drop="drop"
          @paste="pasteFile"
        >
          <div class="flex flex-col items-center justify-center">
            <IconSvg
              class="text-4xl text-gray-700"
              icon="/icons/common/upload-file.svg"
              :size="36"
              fillColor="#000"
            />
            <h5
              class="text-[14px] xl:text-xl mt-5 text-gray-800 font-bold text-center"
            >
              Drag and drop or paste images to upload
            </h5>
            <span
              class="text-xs xl:text-[14px] mt-1 xl:mt-3 text-gray-70 text-center"
            >
              atau
            </span>
            <span
              class="text-sm xl:text-[14px] mt-1 xl:mt-3 text-green-600 underline text-center"
              >Pilih File</span
            >

            <p class="text-[10px] text-gray-600 mt-4 xl:mt-4 text-center">
              {{ sublabel }}
            </p>
            <p class="text-[10px] text-gray-600 mt-2 xl:mt-4 text-center">
              Hanya dapat mengupload 1 file.
            </p>
          </div>
          <input
            id="drag-and-drop-file"
            ref="file"
            type="file"
            class="hidden"
            :accept="detailDragAndDrop.acceptFile"
            @change="onChangeUpload"
          />
        </label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  detailDragAndDrop: {
    type: Object,
    default: () => {},
  },
  heightDragAndDrop: {
    type: String,
    default: "h-40",
  },
  label: {
    type: String,
    default: "",
  },
  sublabel: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["uploadFile", "resetUrl"]);

const files = ref();
const url = ref("");
const dataFiles = reactive({
  name: "",
  mimeType: "",
  fileSize: "",
  fileCorrect: false,
});

const fileInputIsChange = ref(false);

const percentageProggres = ref(0);
const formatSizeFile = ["Bytes", "KB", "MB", "GB", "TB"];
const responseImage = ref("");
const fileIsCorrect = ref(false);
const disabledButton = ref(true);

const onChangeUpload = (e) => {
  if (e.target.files[0]) {
    files.value = e.target.files[0];
    url.value = URL.createObjectURL(files.value);
    dataFiles.name = files.value.name;
    dataFiles.mimeType = files.value.type;
    dataFiles.fileSize = convertSize(files.value.size);
    fileInputIsChange.value = true;
    checkFileValidation();
    dataFiles.fileCorrect = fileIsCorrect.value;
  }
};

const dragover = (e: Event): void => {
  let element = e.target as HTMLInputElement;

  // add style drag and drop
  if (!element.classList.contains("bg-gray-200")) {
    element.classList.remove("bg-gray-50");
    element.classList.add("bg-gray-200");
  }
  e.preventDefault();
};

const dragleave = (e: Event): void => {
  let element = e.target as HTMLInputElement;
  // clear style drag and drop
  element.classList.add("bg-gray-50");
  element.classList.remove("bg-gray-200");
};

const drop = (e: Event): void => {
  e.preventDefault();
  let element = e.target as HTMLInputElement;

  element.files = e?.dataTransfer.files;
  onChangeUpload(e);
  // clear style drag and drop
  element.classList.add("bg-gray-50");
  element.classList.remove("bg-gray-200");
};

const convertSize = (sizeFile: string) => {
  if (sizeFile === 0) {
    return "n/a";
  }
  const indexFileSize = parseInt(
    Math.floor(Math.log(sizeFile) / Math.log(1024))
  );
  if (indexFileSize === 0) {
    return sizeFile + " " + formatSizeFile[indexFileSize];
  }
  return (
    (sizeFile / Math.pow(1024, indexFileSize)).toFixed(1) +
    " " +
    formatSizeFile[indexFileSize]
  );
};

const resetDataFile = () => {
  percentageProggres.value = 0;
  fileInputIsChange.value = false;
  files.value = "";
  responseImage.value = "";
  fileIsCorrect.value = false;
  disabledButton.value = true;
  url.value = "";
  emit("resetUrl");
};

const checkFileValidation = () => {
  if (files.value) {
    if (fileSizeIsCompatible() && formatFileIsCompatible()) {
      fileIsCorrect.value = true;
      disabledButton.value = false;
    } else {
      fileIsCorrect.value = false;
    }
  } else {
    fileIsCorrect.value = false;
  }
};

const fileSizeIsCompatible = () => {
  return files.value.size <= props.detailDragAndDrop.maxSizeFile;
};

const formatFileIsCompatible = () => {
  return props.detailDragAndDrop.formatTypeFile.includes(files.value.type);
};

const selectedDuration = ref(604800);
const durationOptions = reactive([
  { value: 604800, label: "Setelah 1 Minggu" },
  { value: 1209600, label: "Setelah 2 Minggu" },
  { value: 1814400, label: "Setelah 3 Minggu" },
  { value: 2592000, label: "Setelah 1 Bulan" },
  { value: 5184000, label: "Setelah 2 Bulan" },
]);

const onUploadFile = async () => {
  emit("uploadFile", { file: files.value, seconds: selectedDuration.value });
};

const pasteFile = (e: ClipboardEvent): void => {
  e.preventDefault();
  const items = e.clipboardData?.items[0];

  if (items.kind === "file") {
    const pasteFile = items.getAsFile();
    onChangeUpload({ target: { files: [pasteFile] } });
  }
};

const handleGlobalPaste = (event) => {

  const items = event.clipboardData?.items[0];

  if (items.kind === "file") {
    const pasteFile = items.getAsFile();
    onChangeUpload({ target: { files: [pasteFile] } });
  }
};

onMounted(() => {
  window.addEventListener("paste", handleGlobalPaste);
});

onBeforeUnmount(() => {
  window.removeEventListener("paste", handleGlobalPaste);
});
</script>
