<template>
  <button :class="['button', level]">
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: "BaseButton",
  props: {
    level: {
      type: String,
      required: true,
      validation(val) {
        return ["primary", "secondary"].includes(val);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.button {
  border-radius: 4px;
  cursor: pointer;
  padding: 9px 19px;
  border: none;
  font: normal normal bold 20px/25px Helvetica Neue;
  &:hover {
    background: #f7f7f7 0% 0% no-repeat padding-box;
  }
  &.primary {
    color: #24c3c2;
  }
  &.secondary {
    color: #6f7377;
  }
}
</style>
