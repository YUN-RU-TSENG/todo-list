export default {
  name: 'BaseTag',
  template: `<span class="tag" :class="[color]"><slot></slot></span>`,
  props: {
    color: {
      type: String,
      required: true,
      validation(val) {
        return ['blue', 'green', 'orange'].includes(val)
      },
    },
  },
}
