export default {
  name: 'BaseSelect',
  template: `
    <label class="select">
    {{ label }}
        <select v-bind="$attrs" :name="name" @change="$emit('change', $event.target.value)" :value="value">
            <option value="" disabled>--請選擇需要的項目--</option>
            <option v-for="option of options" :value="option.value">{{ option.text }}</option>
        </select>
    </label>`,
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    label: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    value: {
      required: true,
    },
    options: {
      type: Array,
      required: true,
    },
  },
  inheritAttrs: false,
}
