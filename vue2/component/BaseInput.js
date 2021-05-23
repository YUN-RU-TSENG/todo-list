export default {
  name: "BaseInput",
  template: `<label class="input">{{ label }}：<input v-bind="$attrs" :type="type" :value="value" @input='$emit("input", $event.target.value)'></label>`,
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
  inheritAttrs: false,
};
