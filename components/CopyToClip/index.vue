<template>
  <div class="max-w-3xl mx-auto">
    <div class="flex items-center justify-center mt-5">
      <div
        class="flex w-full flex-row items-center justify-between text-sm sm:text-base text-left bg-gray-800 text-white rounded-lg p-2"
      >
        <div class="w-full">
          <p
            class="mb-2 md:whitespace-normal truncate font-lato font-normal text-white flex gap-4 text-sm"
          >
            {{ url }}
          </p>
        </div>
        <div class="flex flex-row">
          <button
            @click="copyToClipboard()"
            class="flex flex-col items-center justify-center h-auto px-3 w-16 pt-2 font-medium pb-1.5 text-[0.65rem] uppercase rounded-md cursor-pointer text-neutral-400 group"
          >
            <IconSvg
              v-show="!copyNotification"
              class="flex-shrink-0 w-5 h-5 mb-1 stroke-current"
              icon="/icons/common/copy.svg"
              :size="20"
              fillColor="#A2A2A2"
            />

            <span v-show="!copyNotification">Copy</span>
            <IconSvg
              v-show="copyNotification"
              class="flex-shrink-0 w-5 h-5 mb-1 bg-green-500 stroke-current"
              icon="/icons/common/copied.svg"
              :size="20"
              fillColor="#3CB043"
            />

            <span
              v-show="copyNotification"
              class="tracking-tight text-green-500"
              x-cloak
              >Copied</span
            >
          </button>
        </div>
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
