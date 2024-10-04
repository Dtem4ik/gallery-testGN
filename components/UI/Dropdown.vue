<template>
  <div class="dropdown-container" ref="dropdown">
    <slot
      name="button"
      :toggleDropdown="toggleDropdown"
      :selectedItems="internalValue"
    ></slot>

    <div v-if="isDropdownOpen" class="dropdown">
      <UIInput v-model="search" />
      <div class="dropdown-actions">
        <span>Выбрано {{ internalValue?.length }} из {{ items?.length }}</span>
        <button type="button" @click="clearSelection" class="dropdown-clear">
          Сбросить
        </button>
      </div>
      <ul class="dropdown-list">
        <li v-for="item in filteredItems" :key="item.id" class="dropdown-item">
          <UICheckbox v-model="internalValue" :value="item.id">
            {{ item.name }}
          </UICheckbox>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    items: {
      type: Array as PropType<
        Array<{ id: number | string; name: string | number }>
      >,
      required: true,
    },
    modelValue: {
      type: Array as PropType<number[] | string[]>,
      required: true,
    },
  })
  const emit = defineEmits(['update:modelValue'])

  const isDropdownOpen = ref(false)
  const search = ref('')
  const dropdown = ref<HTMLElement | null>(null)

  // Вычисляемое значение для внутреннего состояния
  const internalValue = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val),
  })

  // Фильтрация списка элементов на основе поискового запроса
  const filteredItems = computed(() => {
    const query = search.value.toLowerCase().trim()
    return props.items.filter((item) => item.name.toLowerCase().includes(query))
  })

  // Переключение видимости дропдауна
  const toggleDropdown = () => {
    isDropdownOpen.value = !isDropdownOpen.value
  }

  // Сброс выбора
  const clearSelection = () => {
    internalValue.value = []
  }

  // Закрытие дропдауна при клике вне его
  const handleClickOutside = (event: MouseEvent) => {
    if (dropdown.value && !dropdown.value.contains(event.target as Node)) {
      isDropdownOpen.value = false
      search.value = ''
    }
  }

  // Навешивание и снятие обработчика кликов
  onMounted(() => {
    document.addEventListener('click', handleClickOutside)
  })

  onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside)
  })
</script>

<style lang="scss" scoped>
  .dropdown-container {
    position: relative;
    display: inline-block;
  }

  .dropdown {
    position: absolute;
    top: calc(100% + 16px);
    left: 0;
    // right: 0;
    background: white;
    border: 1px solid var(--app-theme-neutral-200);
    border-radius: 8px;
    width: 240px;
    padding: 8px 0;
    box-shadow: 0px 4px 64px 48px #0000000d;
    .custom-input {
      margin: 0 8px;
    }
    &-list {
      max-height: 240px;
      overflow-y: auto;
      list-style: none;
      padding: 0;
      margin: 0;
      padding: 0px 12px;
    }
  }

  .dropdown-item {
    padding: 8px 0;
  }

  .dropdown-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 8px;
    padding: 4px 12px;

    & > * {
      font-size: 12px;
      line-height: 16px;
      font-weight: 500;
    }
    span {
      color: var(--app-theme-neutral-600);
    }
  }

  .dropdown-clear {
    color: var(--app-theme-primary-blue-500);
    border: none;
    cursor: pointer;
  }
</style>
