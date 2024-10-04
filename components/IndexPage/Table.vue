<template>
  <div class="data-table">
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
          <td width="23%">{{ book.title || '-' }}</td>
          <td width="17%">{{ book.author_name?.join(', ') || '-' }}</td>
          <td width="10%" align="right">
            {{ book.first_publish_year || '-' }}
          </td>
          <td class="py-20" width="50%">
            <div class="d-flex align-center ga-12 flex-wrap">
              <div
                v-for="(badge, j) in formatDisplay(book?.format, i)"
                :key="`badge-${i}-${j}`"
                class="badge bg-primary-50 rounded-8"
              >
                {{ badge }}
              </div>

              <div
                v-if="book?.format?.length > 3"
                class="badge bg-primary-50 rounded-8 expand-more"
                @click="toggleFormats(i)"
              >
                {{
                  !expandedBooks[i]
                    ? `еще +${book.format.length - 3}`
                    : 'скрыть'
                }}
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
      v-show="!isLoading && !books?.length"
      class="d-flex py-24 align-center justify-center"
    >
      <h3>Ничего не нашлось, попробуйте изменить критерии поиска...</h3>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import type { IBook } from '~/types'
  const props = defineProps({
    books: Array as PropType<IBook[]>,
    isLoading: Boolean,
  })

  const expandedBooks = reactive<Record<number, boolean>>({})

  const toggleFormats = (index: number) => {
    expandedBooks[index] = !expandedBooks[index]
  }

  const formatDisplay = (formats: string[], index: number) => {
    if (!formats) return ['-']
    if (expandedBooks[index]) {
      return formats
    }
    return formats.slice(0, 3)
  }
</script>

<style lang="scss" scoped>
  .data-table {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    overflow-x: auto;
  }
  .custom-table {
    width: 100%;
    height: 100%;
    table-layout: fixed;
    border-collapse: collapse;
    min-width: 800px;
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
      display: flex;
      flex-direction: column;
      width: 100%;
      max-height: calc(100vh - 226px);
      overflow-y: auto;
      overflow-x: hidden;
      @media (max-width: 920px) {
        max-height: calc(100vh - 320px);
      }
      tr {
        flex: 1;
        table-layout: auto;
        background-color: var(--app-theme-white);
        transition: background 0.2s;
        border-bottom: 1px solid var(--app-theme-neutral-200);
        &:hover {
          background-color: var(--app-theme-neutral-50);
        }
      }
      td {
        display: inline-block;
        padding: 24px 24px;
        font-size: 14px;
        line-height: 16px;
        font-weight: 400;
        color: var(--app-theme-neutral-900);
      }
    }
    .expand-more {
      cursor: pointer;
    }
  }
</style>
