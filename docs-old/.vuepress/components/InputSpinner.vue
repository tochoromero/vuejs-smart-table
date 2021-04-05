<template>
  <div>
    <div class="input-group input-spinner"
         :style="{width: componentWidth, 'min-width': '9rem'}">
      <div class="input-group-prepend">
        <button class="btn btn-outline-secondary"
                type="button"
                :disabled="isSubtractDisabled || disabled"
                @click="subtract">
          <i class="fas fa-minus"/>
        </button>
      </div>

      <input type="number"
             class="form-control inputSpinner"
             v-model.number.trim="numValue"
             :style="inputWidthStyle"
             :readonly="readonly || disabled"
             @input="onInput"/>

      <div class="input-group-append">
        <button class="btn btn-outline-secondary"
                type="button"
                :disabled="isAddDisabled || disabled"
                @click="add">
          <i class="fas fa-plus"/>
        </button>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'InputSpinner',
  props: {
    min: {
      type: Number,
      required: false
    },
    max: {
      type: Number,
      required: false
    },
    value: {
      type: Number,
      required: false,
      default: 0
    },
    precision: {
      type: Number,
      required: false,
      default: 0
    },
    step: {
      type: Number,
      required: false,
      default: 1
    },
    inputWidth: {
      type: String,
      required: false,
      default: null
    },
    componentWidth: {
      type: String,
      required: false,
      default: '100%'
    },
    readonly: {
      type: Boolean,
      required: false,
      default: true
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data () {
    return {
      numValue: this.value
    }
  },
  computed: {
    isAddDisabled () {
      if (!Number.isFinite(this.max)) {
        return false
      }

      return this.numValue + this.step > this.max
    },
    isSubtractDisabled () {
      if (!Number.isFinite(this.min)) {
        return false
      }

      return this.numValue - this.step < this.min
    },
    inputWidthStyle () {
      if (this.inputWidth) {
        return {
          'max-width': this.inputWidth,
          'width': this.inputWidth
        }
      }
    }
  },
  watch: {
    value (newValue, oldValue) {
      if (newValue !== oldValue) {
        this.numValue = newValue
      }
    }
  },
  methods: {
    add () {
      if (this.isAddDisabled) {
        return
      }
      this.numValue = Number(this.numValue) + this.step
      this.numValue = Number(this.numValue.toFixed(this.precision))

      this.$emit('input', this.numValue)
    },
    subtract () {
      if (this.isSubtractDisabled) {
        return
      }
      this.numValue = Number(this.numValue) - this.step
      this.numValue = Number(this.numValue.toFixed(this.precision))

      this.$emit('input', this.numValue)
    },
    onInput (event) {
      const inputValue = event.target.value
      let parsed = Number(parseFloat(inputValue).toFixed(this.precision))

      if (isNaN(parsed)) {
        if (typeof this.min === 'number') {
          parsed = this.min
        } else {
          parsed = 0
        }
      }

      if (typeof this.min === 'number' && parsed < this.min) {
        parsed = this.min
      }

      if (typeof this.max === 'number' && parsed > this.max) {
        parsed = this.max
      }

      if (inputValue[0] === '0' && !inputValue.includes('.')) {
        event.target.value = parsed
      }
      this.numValue = parsed

      this.$emit('input', this.numValue)
    }
  }
}
</script>

<style scoped>
  .inputSpinner {
    background-color: white !important;
    text-align: center;
  }
</style>
