<template>
  <header class="header px-24 pt-24 pb-16">
    <div class="header__body card rounded-16 bg-white py-16 px-24">
      <h1 class="header__title font-size-18 line-height-24">
        Тестовое задание
      </h1>
    </div>
  </header>

  <main class="main-content px-24 pb-24">
    <div class="card bg-white rounded-16">
      <form
        @submit.prevent="loadData(true)"
        class="search-form d-flex align-center justify-space-between py-12 px-24"
      >
        <div>
          <UIInput v-model="q" />
        </div>
        <div class="d-flex align-center ga-12">
          <UIDropdown
            v-model="selectedYears"
            :items="
              yearsList.map((el) => {
                return { name: String(el), id: el };
              })
            "
            ><template #button="{ toggleDropdown }">
              <button type="button" @click="toggleDropdown">
                Открыть дропдаун
              </button>
            </template>
          </UIDropdown>
          <UIDropdown
            v-model="selectedFormats"
            :items="
              formatsList.map((el) => {
                return { name: String(el), id: el };
              })
            "
            ><template #button="{ toggleDropdown }">
              <button type="button" @click="toggleDropdown">
                Открыть дропдаун
              </button>
            </template>
          </UIDropdown>
          <button type="submit">Поиск</button>
        </div>
      </form>

      <table class="custom-table">
        <thead>
          <tr>
            <th width="23%">Название</th>
            <th width="17%">Автор</th>
            <th width="10%">Год издания</th>
            <th width="50%">Формат книги</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(book, i) in books" :key="`book-index-${i}`">
            <td width="23%">{{ book.title || "-" }}</td>
            <td width="17%">{{ book.author_name?.join(", ") || "-" }}</td>
            <td width="10%" align="right">
              {{ book.first_publish_year || "-" }}
            </td>
            <td class="py-20" width="50%">
              <div class="d-flex align-center ga-12">
                <div
                  v-for="(badge, j) in formatDisplay(book?.format)"
                  class="badge bg-primary-50 rounded-8"
                >
                  {{ badge }}
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-show="isLoading" class="d-flex py-24 align-center justify-center">
        <UISpiner />
      </div>
      <div
        v-show="!isLoading && !books.length"
        class="d-flex py-24 align-center justify-center"
      >
        <h3>Ничего не нашлось, попробуйте изменить критерии поиска...</h3>
      </div>
    </div>
  </main>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";

const books = ref<any[]>([]);
const booksFound = ref<number>(null);
const isLoading = ref(false);
const stopLoad = ref(false);
const page = ref(1);

const selectedYears = ref([]);
const selectedFormats = ref([]);

const q = ref("");

const formatsList = computed(() => {
  const formats = books.value
    .map((book) => book.format)
    .filter(Boolean)
    .flat();
  return Array.from(new Set(formats));
});
const yearsList = computed(() => {
  const years = books.value
    .map((book) => book.first_publish_year)
    .filter(Boolean);
  return Array.from(new Set(years)).sort((a, b) => a - b);
});

const loadData = async (resetPagination: boolean = false) => {
  if (isLoading.value) return;
  isLoading.value = true;

  try {
    if (resetPagination) {
      page.value = 1;
      stopLoad.value = false;
      books.value = [];
    }
    if (stopLoad.value) {
      return;
    }
    const { data, error } = await useApi<any[]>(
      `search.json?q=${
        q.value
          ? q.value.replace(/\s+/g, " ").replace(/ /g, "+")
          : "the+lord+of+the+rings"
      }&fields=title,first_publish_year,format,author_name&limit=50&page=${
        page.value
      }&lang=ru`
    );
    books.value = [...books.value, ...data.value?.docs];
    booksFound.value = data.value.numFound;
    page.value++;
    if (books.value.length >= booksFound.value) {
      stopLoad.value = true;
    }
  } catch (error) {
    console.error("Ошибка загрузки данных:", error);
  } finally {
    isLoading.value = false;
  }
};

// Первоначальная загрузка данных
loadData();

// Обработчик прокрутки
const handleScroll = (event: Event) => {
  const target = event.target as HTMLElement;
  if (target.scrollTop + target.clientHeight + 400 >= target.scrollHeight) {
    loadData();
  }
};

onMounted(() => {
  const tableBody = document.querySelector(".custom-table tbody");
  if (tableBody) {
    tableBody.addEventListener("scroll", handleScroll);
  }
});

const formatDisplay = (formats) => {
  if (!formats) {
    return ["-"];
  }
  if (formats.length > 3) {
    return [...formats.slice(0, 3), `еще +${formats.length - 3}`];
  }
  return formats;
};
</script>

<style scoped lang="scss">
header.header {
}
main.main-content {
  .card {
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
}

.custom-table {
  width: 100%;
  height: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  thead {
    display: block;
    width: 100%;
    background: var(--app-theme-neutral-100);
    tr {
      table-layout: auto;
      width: 100%;
      display: flex;
    }
    th {
      padding: 12px 24px;
      text-align: left;
      font-size: 12px;
      line-height: 16px;
      font-weight: 500;
      color: var(--app-theme-neutral-600);
    }
  }
  tbody {
    display: block;
    width: 100%;
    max-height: calc(100vh - 226px);
    overflow-y: auto;
    overflow-x: hidden;
    tr {
      table-layout: auto;
      background-color: var(--app-theme-white);
      transition: background 0.2s;
      border-bottom: 1px solid var(--app-theme-neutral-200);
      &:hover {
        background-color: var(--app-theme-neutral-50);
      }
    }
    td {
      padding: 24px 24px;
      font-size: 14px;
      line-height: 16px;
      font-weight: 400;
      color: var(--app-theme-neutral-900);
    }
  }
}

.search-form {
  .custom-input {
    min-width: 360px;
  }
}
</style>
