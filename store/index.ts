import { defineStore } from "pinia";

export const useDataImage = defineStore("data-image", {
  state: () => {
    return {
      dataImage: {},
    };
  },
});
