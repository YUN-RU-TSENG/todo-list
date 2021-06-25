import { ref } from "@vue/reactivity";

export default function toggleForm() {
  const isShow = ref(false);

  function toggleShow() {
    console.log(1);
    isShow.value = !isShow.value;
  }

  return {
    toggleShow,
    isShow
  };
}
