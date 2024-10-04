<template>
  <label class="custom-checkbox">
    <input
      type="checkbox"
      :value="value"
      v-model="modelValue"
      @change="$emit('update:modelValue', modelValue)"
    />
    <span class="custom-checkbox__custom"></span>
    <span class="custom-checkbox__label">
      <slot></slot>
    </span>
  </label>
</template>

<script lang="ts" setup>
  const props = defineProps<{
    modelValue: boolean | Array<string | number>
    value?: string | number
  }>()

  const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean | Array<string | number>): void
  }>()

  const modelValue = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val),
  })
</script>

<style scoped lang="scss">
  .custom-checkbox {
    display: flex;
    align-items: center;
    cursor: pointer;
    gap: 12px;
    position: relative;
    z-index: 1;

    input {
      opacity: 0;
      position: absolute;
      left: 0;
      width: 0;
      height: 0;
      z-index: -1;
    }

    &_label {
      font-size: 14px;
      line-height: 16px;
      color: var(--app-theme-neutral-900);
    }

    &__custom {
      width: 16px;
      height: 16px;
      border: 1px solid var(--app-theme-neutral-500);
      border-radius: 4px;
      position: relative;
      transition: 0.3s ease-out;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 1px;
      opacity: 1;
      &::before {
        content: '';
        position: absolute;
        width: 32px;
        height: 32px;
        border-radius: 100%;
        background-color: var(--app-theme-primary-blue-50);
        opacity: 0;
        z-index: -1;
        transition: 0.3s ease-out;
      }
      &:hover {
        border-color: var(--app-theme-primary-blue-500);
        &::before {
          opacity: 1;
        }
      }
    }

    input:checked + .custom-checkbox__custom {
      background-color: var(--app-theme-primary-blue-500);
      border-color: var(--app-theme-primary-blue-500);
    }

    input:checked + .custom-checkbox__custom::after {
      content: '';
      display: block;
      width: 10px;
      height: 10px;
      background-image: url(/icons/checked.svg);
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
      transition: 0.3s ease-out;
    }
  }
</style>
