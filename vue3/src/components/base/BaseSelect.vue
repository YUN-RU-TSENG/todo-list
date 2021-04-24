
<template>

  <label class="select">
    {{ label }}
    <select v-bind="$attrs"
            :name="name"
            @change="$emit('update:value', $event.target.value)"
            :value="value">
      <option value=""
              disabled>--請選擇需要的項目--</option>
      <option v-for="option of options"
              :value="option.value"
              :key="option.value">{{ option.text }}</option>
    </select>
  </label>
</template>

<script>
export default {
  name: 'BaseSelect',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    label: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    value: {
      required: true
    },
    options: {
      type: Array,
      required: true
    }
  },
  emits: ['update:value'],
  inheritAttrs: false
}
</script>

<style lang="scss" scoped>
.select {
    display: block;
    text-align: left;
    font: normal normal bold 16px/19px Helvetica Neue;
    color: #6F7377;
    select {
        margin-top: 7px;
        width: 100%;
        background: #F7F7F7 0% 0% no-repeat padding-box;
        border: 1px solid #B5BABF;
        border-radius: 4px;
        outline: none;
        font: normal normal normal 16px/18px Helvetica Neue;
        padding: 12px 14px;
    }
}
</style>
