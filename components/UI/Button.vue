<template>
  <button
    :type="btnType"
    :class="`custom-button bg-${color}`"
    @click="handleClick"
  >
    <slot name="icon">
      <img :src="icon" alt="icon" v-if="icon" class="custom-button__icon" />
    </slot>
    <slot></slot>
  </button>
</template>

<script lang="ts" setup>
  const props = defineProps({
    icon: {
      type: String,
      default: '',
      required: false,
    },
    btnType: {
      type: String as PropType<'button' | 'submit' | 'reset'>,
      default: 'button',
    },
    color: {
      type: String,
      default: 'primary-500',
    },
  })

  // Описание событий
  const emit = defineEmits<{
    (e: 'click'): void
  }>()

  // Обработка клика
  const handleClick = () => {
    emit('click')
  }
</script>

<style scoped lang="scss">
  .custom-button {
    padding: 12px 20px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    border-radius: 8px;
    font-size: 14px;
    line-height: 16px;
    font-weight: 500;
    transition: 0.3s ease-out;
    &::after {
      content: '';
      display: block;
      height: 0;
      width: 0;
      position: absolute;
      border-radius: 100%;
      transition: 0.3s ease-out;
    }
    &:active {
      transform: scale(0.97);
      background-color: var(--active-bg, --app-theme-primary-blue-500);
    }

    &:hover {
      background-color: var(--hover-bg, --app-theme-primary-blue-500);
      &::after {
        background-color: #ffffff1a;
        width: 118px;
        height: 118px;
      }
    }

    &__icon {
    }
  }
</style>
