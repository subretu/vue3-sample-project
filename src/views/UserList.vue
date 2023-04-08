<template>
  <v-container>
    <v-btn color="primary" @click="dialog = true"> Open Dialog </v-btn>
    <v-dialog v-model="dialog" width="auto">
      <v-card>
        <v-card-text> {{ selectedItems }} </v-card-text>
        <v-card-actions>
          <v-btn color="primary" block @click="dialog = false"
            >Close Dialog</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-row>
      <v-col cols="10">
        <v-sheet color="white" elevation="1">
          <v-data-table
            v-model="selectedItems"
            show-select
            :headers="headers"
            :items="items"
            item-value="items"
            :single-select="false"
          >
          </v-data-table>
          <template v-slot:[`item.selected`]="{ item }">
            <v-checkbox v-model="item.selected"></v-checkbox>
          </template>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { ref } from "vue";

interface TableItem {
  id: number;
  name: string;
  age: number;
  selected: boolean;
}

export default {
  setup() {
    const headers = [
      { title: "", key: "selected", sortable: false },
      { title: "ID", key: "id" },
      { title: "名前", key: "name" },
      { title: "年齢", key: "age" },
    ];
    const items: TableItem[] = [
      {
        id: 1,
        name: "高田健志",
        age: 33,
        selected: false,
      },
      {
        id: 2,
        name: "横山緑",
        age: 42,
        selected: false,
      },
      {
        id: 4,
        name: "山崎イチゴ",
        age: 12,
        selected: false,
      },
      {
        id: 5,
        name: "山田ニゴ",
        age: 16,
        selected: false,
      },
      {
        id: 6,
        name: "山本一之進",
        age: 12,
        selected: false,
      },
    ];

    const dialog = ref(false);

    const selectedItems = ref<TableItem[]>([]);

    return {
      selectedItems,
      headers,
      items,
      dialog,
    };
  },
};
</script>
