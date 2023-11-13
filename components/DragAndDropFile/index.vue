<template>
  <div class="max-w-3xl mx-auto">
    <div class="font-lato text-gray-800">
      <slot name="header" />
      <div class="flex items-center justify-between">
        <div>
          <label
            for="delete-image-times"
            class="block mb-2 text-sm font-bold text-gray-900 dark:text-white"
            >Auto Delete Image :
          </label>
          <select
            v-model="selectedDuration"
            id="delete-image-times"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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

        <button
          type="button"
          :disabled="disabledButton"
          :class="{
            'cursor-not-allowed': disabledButton,
            'opacity-50': disabledButton,
          }"
          @click="onUploadFile()"
          class="px-3 py-2 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Upload File
        </button>
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
          <div class="mb-3 flex items-center justify-center">
            <NuxtIcon
              name="common/document"
              class="h-9 w-9 text-4xl text-gray-600"
            />
          </div>

          <div class="flex w-full flex-row items-center justify-between">
            <div class="w-[85%]">
              <p
                class="mb-2 truncate font-lato text-[14px] font-normal text-black"
              >
                {{ dataFiles.name }}
              </p>
              <template v-if="proggresBarIsSuccess">
                <div class="mb-1 h-1.5 w-full rounded-full bg-gray-200">
                  <div
                    class="h-1.5 rounded-full bg-green-500"
                    :style="{ width: percentageProggres + '%' }"
                  />
                </div>
                <div class="mb-1">
                  <span class="font-lato text-[11px] font-normal text-gray-600">
                    Diupload ... {{ percentageProggres }} %
                  </span>
                </div>
              </template>
              <template v-else>
                <p class="mb-2 font-lato text-[11px] font-normal text-gray-600">
                  Ukuran {{ dataFiles.fileSize }}
                </p>
              </template>

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
                <NuxtIcon name="common/trash" class="h-4 w-4 text-red-600" />
              </button>
              <button class="ml-5 w-4" @click.prevent="previewFile">
                <NuxtIcon
                  v-if="!proggresBarIsSuccess"
                  name="common/eyes"
                  class="h-4 w-4 text-green-600"
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
        >
          <div class="flex flex-col items-center justify-center">
            <NuxtIcon
              name="common/upload-file"
              class="mb-3 text-4xl text-gray-700"
            />
            <h5 class="text-xl mt-5 text-gray-800 font-bold">
              Drop Files to Upload
            </h5>
            <p class="mt-1 text-gray-700">atau</p>
            <span class="mt-2 text-green-600 underline">Pilih File</span>

            <p class="text-xs text-gray-600 mt-4">{{ sublabel }}</p>
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
import { useDataImage } from "@/store/index";

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

const emit = defineEmits(["uploadFile"]);

const files = ref();
const dataFiles = ref({
  name: "",
  mimeType: "",
  fileSize: "",
  fileCorrect: false,
});
const fileInputIsChange = ref(false);
const proggresBarIsSuccess = ref(false);
const percentageProggres = ref(0);
const intervalPercentage = ref(null);
const formatSizeFile = ["Bytes", "KB", "MB", "GB", "TB"];
const responseImage = ref("");
const fileIsCorrect = ref(false);
const disabledButton = ref(true);

const onChangeUpload = (e) => {
  if (e.target.files[0]) {
    files.value = e.target.files[0];
    dataFiles.value.name = files.value.name;
    dataFiles.value.mimeType = files.value.type;
    dataFiles.value.fileSize = convertSize(files.value.size);
    fileInputIsChange.value = true;
    runProgressBar();
    checkFileValidation();
    dataFiles.value.fileCorrect = fileIsCorrect.value;
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

const runProgressBar = () => {
  if (percentageProggres.value === 0) {
    proggresBarIsSuccess.value = true;
    percentageProggres.value = 1;
    intervalPercentage.value = setInterval(setProggresBar, 10);
  }
};

const setProggresBar = () => {
  if (percentageProggres.value >= 100) {
    clearInterval(intervalPercentage.value);
    percentageProggres.value = 0;
    proggresBarIsSuccess.value = false;
  } else {
    percentageProggres.value++;
  }
};

const resetDataFile = () => {
  percentageProggres.value = 0;
  proggresBarIsSuccess.value = false;
  fileInputIsChange.value = false;
  files.value = "";
  responseImage.value = "";
  fileIsCorrect.value = false;
  disabledButton.value = true;
  useDataImage().dataImage = {};
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

const selectedDuration = ref(60);
const durationOptions = ref([
  { value: 60, label: "Setelah 1 menit" },
  { value: 300, label: "Setelah 5 menit" },
  { value: 600, label: "Setelah 10 menit" },
  { value: 1800, label: "Setelah 30 menit" },
  { value: 3600, label: "Setelah 1 jam" },
  { value: 10800, label: "Setelah 3 jam" },
  { value: 21600, label: "Setelah 6 jam" },
  { value: 43200, label: "Setelah 12 jam" },
  { value: 86400, label: "Setelah 1 hari" },
  { value: 604800, label: "Setelah 1 Minggu" },
  { value: 2592000, label: "Setelah 1 bulan" },
]);

const onUploadFile = async () => {
  emit("uploadFile", { file: files.value, seconds: selectedDuration.value });
};
</script>
