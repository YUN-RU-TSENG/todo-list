<template>
  <label class="input">{{ label }}：<input v-bind="$attrs"
           :type="type"
           :value="value"
           @input='$emit("update:value", $event.target.value)'></label>
</template>

<script>
  export default {
    name: 'BaseInput',
    props: {
      label: {
        type: String,
        required: true,
      },
      type: {
        type: String,
      },
      value: {
        required: true,
      },
    },
    emits: ['update:value'],
    inheritAttrs: false,
  };
</script>

<style lang="scss" scoped>
  .input {
    display: block;
    text-align: left;
    font: normal normal bold 16px/19px Helvetica Neue;
    color: #6f7377;
    input {
      margin-top: 7px;
      width: 100%;
      background: #f7f7f7 0% 0% no-repeat padding-box;
      border: 1px solid #b5babf;
      border-radius: 4px;
      outline: none;
      font: normal normal normal 16px/18px Helvetica Neue;
      padding: 12px 14px;
      &:checked,
      &:active,
      &:focus {
        border: 1px solid #24c3c2;
      }
    }
  }
</style>
