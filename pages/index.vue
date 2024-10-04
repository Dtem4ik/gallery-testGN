<template>
  <DefaultHeader />

  <main class="main-content px-24 pb-24">
    <div class="card bg-white rounded-16">
      <form
        @submit.prevent="handleSearch()"
        class="search-form d-flex align-center justify-space-between py-12 px-24"
      >
        <div class="d-flex align-center ga-12">
          <UIInput v-model="q" />
        </div>

        <div class="d-flex align-center ga-12">
          <UIDropdown v-model="selectedYears" :items="yearsList"
            ><template #button="{ toggleDropdown }">
              <UIButton
                color="neutral-100"
                @click="toggleDropdown"
                icon="/icons/calendar.svg"
                >Год</UIButton
              >
            </template>
          </UIDropdown>

          <UIDropdown v-model="selectedFormats" :items="formatsList"
            ><template #button="{ toggleDropdown }">
              <UIButton
                color="neutral-100"
                @click="toggleDropdown"
                icon="/icons/books.svg"
                >Формат книги</UIButton
              >
            </template>
          </UIDropdown>

          <UIButton btn-type="submit" icon="/icons/search-white.svg"
            >Поиск</UIButton
          >
        </div>
      </form>

      <IndexPageTable :isLoading="isLoading" :books="filteredBooks" />
    </div>
  </main>
</template>

<script lang="ts" setup>
  import type { IBookFetchData, IBook } from '~/types'

  const books = ref<IBook[]>([])
  const isLoading = ref(false)
  const stopLoad = ref(false)
  const page = ref(1)
  const q = ref('')
  const selectedYears = ref<string[]>([])
  const selectedFormats = ref<string[]>([])

  const formatsList = computed(() => {
    const formats = books.value.flatMap((book) => book.format).filter(Boolean)
    return [...new Set(formats)].map((el) => ({
      name: String(el),
      id: String(el),
    }))
  })

  const yearsList = computed(() => {
    const years = books.value
      .map((book) => book.first_publish_year)
      .filter(Boolean)
    return [...new Set(years)]
      .sort((a, b) => a - b)
      .map((el) => ({ name: String(el), id: String(el) }))
  })

  const filteredBooks = computed(() => {
    return books.value.filter((book) => {
      const yearMatch =
        selectedYears.value.length === 0 ||
        selectedYears.value.includes(String(book.first_publish_year))

      const formatMatch =
        selectedFormats.value.length === 0 ||
        selectedFormats.value.some((format) => book.format?.includes(format))
      return yearMatch && formatMatch
    })
  })

  const fetchBooksData = async (resetPagination: boolean = false) => {
    if (isLoading.value) return
    isLoading.value = true

    try {
      if (resetPagination) {
        page.value = 1
        stopLoad.value = false
        books.value = []
        selectedYears.value = []
        selectedFormats.value = []
      }
      if (stopLoad.value) return

      const params = new URLSearchParams({
        q: q.value || 'the lord of the rings',
        fields: 'title,first_publish_year,format,author_name',
        limit: '1000',
        page: String(page.value),
        lang: 'ru',
      })

      const { data } = await useApi<IBookFetchData>(
        `search.json?${params.toString()}`,
      )
      if (data.value && data.value.docs) {
        books.value = [...books.value, ...data.value.docs]
      }
      stopLoad.value = books.value.length >= (data.value?.numFound || 0)
      page.value++
    } catch (error) {
      console.error('Ошибка загрузки данных:', error)
    } finally {
      isLoading.value = false
    }
  }

  const handleSearch = () => {
    fetchBooksData(true)
  }

  // Первоначальная загрузка данных
  fetchBooksData()

  // Обработчик прокрутки
  const handleScroll = (event: Event) => {
    const target = event.target as HTMLElement
    if (target.scrollTop + target.clientHeight + 400 >= target.scrollHeight) {
      fetchBooksData()
    }
  }

  onMounted(() => {
    const tableBody = document.querySelector('.custom-table tbody')
    if (tableBody) {
      tableBody.addEventListener('scroll', handleScroll)
    }
  })
</script>

<style scoped lang="scss">
  header.header {
  }
  main.main-content {
    .card {
      overflow: hidden;
      display: flex;
      flex-direction: column;
      min-height: 500px;
    }
  }

  .search-form {
    .custom-input {
      min-width: 360px;
    }

    @media (max-width: 920px) {
      flex-direction: column;
      gap: 12px;
      .custom-input {
        min-width: 100%;
      }
    }
  }
</style>
