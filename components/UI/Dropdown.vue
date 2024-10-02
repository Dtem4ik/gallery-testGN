<template>
  <div class="dropdown-container" ref="dropdown">
    <slot
      name="button"
      :toggleDropdown="toggleDropdown"
      :selectedItems="selectedItems"
    ></slot>

    <div v-if="isDropdownOpen" class="dropdown">
      <UIInput v-model="search" />
      <div class="dropdown-actions">
        <span>Выбрано {{ selectedItems?.length }} из {{ items?.length }}</span>
        <button type="button" @click="clearSelection" class="dropdown-clear">
          Сбросить
        </button>
      </div>
      <ul class="dropdown-list">
        <li v-for="item in filteredItems" :key="item.id" class="dropdown-item">
          <label>
            <input type="checkbox" :value="item.id" v-model="internalValue" />
            {{ item.name }}
          </label>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  items: {
    type: Array as PropType<Array<{ id: number; name: string }>>,
    required: true,
  },
  modelValue: {
    type: Array as PropType<number[]>,
    required: true,
  },
});
const emit = defineEmits(["update:modelValue"]);

const isDropdownOpen = ref(false);
const search = ref("");
const dropdown = ref<HTMLElement | null>(null);

// Внутреннее состояние для выбранных значений
const internalValue = ref<number[]>([...props.modelValue]);

// Синхронизация внутреннего значения с моделью
const updateModelValue = () => {
  emit("update:modelValue", internalValue.value);
};

// Фильтрация списка элементов на основе поискового запроса
const filteredItems = computed(() => {
  const query = search.value.toLowerCase().trim();
  return props.items.filter((item) => item.name.toLowerCase().includes(query));
});

// Список выбранных элементов
const selectedItems = computed(() => {
  return internalValue.value;
});

// Переключение видимости дропдауна
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

// Сброс выбора
const clearSelection = () => {
  internalValue.value = [];
  updateModelValue();
};

// Применение выбора и закрытие дропдауна
const applySelection = () => {
  updateModelValue();
};

// Закрытие дропдауна при клике вне его
const handleClickOutside = (event: MouseEvent) => {
  if (dropdown.value && !dropdown.value.contains(event.target as Node)) {
    isDropdownOpen.value = false;
    search.value = "";
  }
};

watch(
  () => internalValue.value,
  (newValue) => {
    applySelection();
  },
  { deep: true }
);

// Навешивание и снятие обработчика кликов
onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style lang="scss" scoped>
.dropdown-container {
  position: relative;
  display: inline-block;
}

.dropdown {
  position: absolute;
  top: calc(100% + 16px);
  /* left: 0; */
  right: 0;
  background: white;
  border: 1px solid var(--app-theme-neutral-200);
  border-radius: 8px;
  width: 240px;
  padding: 8px;
  box-shadow: 0px 4px 64px 48px #00000003;
  &-list {
    max-height: 150px;
    overflow-y: auto;
    list-style: none;
    padding: 0;
    margin: 0;
  }
}

.dropdown-item {
  padding: 5px 0;
}

.dropdown-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  padding: 4px 0;

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
