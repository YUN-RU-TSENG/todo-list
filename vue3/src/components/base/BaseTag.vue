
<template>
  <span :class="['tag', color]">
    <slot></slot>
  </span>
</template>

<script>
export default {
  name: 'BaseTag',
  template: '',
  props: {
    color: {
      type: String,
      required: true,
      validation (val) {
        return ['blue', 'green', 'orange'].includes(val)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .tag {
    padding: 5px 13px;
    border-radius: 16px;
    font: normal normal normal 12px Helvetica Neue;
    &.blue {
        background-color: #24C3C2;
    }
    &.green {
        background-color: #A4C324;
    }
    &.orange {
        background-color: #C69B93;
    }
}
</style>
