<template>
  <div class="px-3 xl:px-0 max-w-3xl mx-auto mt-5">
    <label class="block mt-2 text-sm font-bold text-gray-900 mb-1"
      >{{ label }} :
    </label>
    <div class="flex items-center justify-center">
      <div class="relative w-full">
        <input
          type="search"
          class="block p-2.5 w-full z-20 text-sm text-white bg-gray-800 rounded border-s-gray-800"
          :value="url"
          disabled
        />
        <button
          @click="copyToClipboard()"
          class="absolute top-0 end-0 p-2.5 text-sm font-medium h-full bg-gray-800 rounded"
        >
          <IconSvg
            v-show="!copyNotification"
            class="flex-shrink-0 w-5 h-5 mb-1 stroke-current"
            icon="/icons/common/copy.svg"
            :size="20"
            fillColor="#A2A2A2"
          />

          <IconSvg
            v-show="copyNotification"
            class="flex-shrink-0 w-5 h-5 mb-1 bg-green-500 stroke-current"
            icon="/icons/common/copied.svg"
            :size="20"
            fillColor="#3CB043"
          />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  url: {
    type: String,
    default: "",
  },
  label: {
    type: String,
    default: "",
  },
});

const copyNotification = ref(false);
const copyToClipboard = () => {
  copyNotification.value = true;
  navigator.clipboard.writeText(props.url);
  setTimeout(function () {
    copyNotification.value = false;
  }, 3000);
};
</script>
