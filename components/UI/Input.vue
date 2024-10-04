<template>
  <label class="custom-input">
    <input
      type="text"
      v-model.trim="inputValue"
      :placeholder="placeholder"
      @input="$emit('update:modelValue', inputValue)"
    />
    <button type="button" v-show="inputValue.length" @click="clearInput">
      <img
        class="mr-4"
        width="16"
        height="16"
        src="/icons/close.svg"
        alt="clear"
      />
    </button>
    <img width="16" height="16" :src="icon" alt="search" />
  </label>
</template>

<script setup lang="ts">
  const props = defineProps({
    modelValue: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
      default: 'Поиск',
    },
    icon: {
      type: String,
      default: '/icons/search.svg',
    },
  })

  const emit = defineEmits(['update:modelValue'])

  const inputValue = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val),
  })

  const clearInput = () => {
    inputValue.value = ''
    emit('update:modelValue', '')
  }
</script>

<style scoped lang="scss">
  .custom-input {
    background: var(--app-theme-neutral-100);
    border-radius: 8px;
    padding: 12px 16px;
    display: flex;
    align-items: center;
    gap: 4px;
    transition: 0.3s ease-out;
    border: 1px solid transparent;
    &:hover {
      background-color: var(--app-theme-primary-blue-50);
      cursor: text;
    }
    &:focus-within {
      background: var(--app-theme-neutral-100);
      border: 1px solid var(--app-theme-primary-blue-500);
    }
    input {
      background: transparent;
      font-size: 14px;
      line-height: 16px;
      width: 100%;
    }
    img {
      min-width: 16px;
    }
  }
</style>
