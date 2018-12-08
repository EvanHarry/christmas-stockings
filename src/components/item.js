export default {
  props: {
    fields: {
      type: Array,
      required: true
    }
  },
  methods: {
    getRules (item) {
      const rules = [
        {
          name: 'required',
          func: value => {
            return !!value || 'Required.'
          }
        },
        {
          name: 'number',
          func: value => {
            return !isNaN(value) || 'Must be a number.'
          }
        },
        {
          name: 'email',
          func: value => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(value) || 'Invalid e-mail.'
          }
        }
      ]

      return rules
        .filter(m => item.includes(m.name))
        .map(m => m.func)
    }
  }
}
