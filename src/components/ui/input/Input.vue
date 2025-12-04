<script setup>
import { computed, useAttrs } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps({
  modelValue: [String, Number],
  type: { type: String, default: 'text' },
  disabled: Boolean,
  class: String
})

const emit = defineEmits(['update:modelValue'])

const attrs = useAttrs()

const classes = computed(() => cn(
  'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
  props.class
))

function onInput(e) {
  emit('update:modelValue', e.target.value)
}
</script>

<template>
  <input
    :type="type"
    :class="classes"
    :value="modelValue"
    :disabled="disabled"
    v-bind="attrs"
    @input="onInput"
  />
</template>
