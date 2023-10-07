<template>
  <v-container>
    <v-btn color="primary" @click="dialog = true"> Open Dialog </v-btn>
    <v-dialog v-model="dialog" width="auto">
      <v-card>
        <v-card-text> {{ multiplication }} </v-card-text>
        <v-text-field
          label="Main input"
          hide-details="auto"
          v-model="inputNumber"
        ></v-text-field>
        <v-card-actions>
          <v-btn color="primary" block @click="closeDialog">Close Dialog</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-row>
      <v-col cols="10">
        <v-sheet color="white" elevation="1">
          <v-data-table
            show-select
            :headers="headers"
            :items="viewData"
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
import { ref, reactive, computed, onMounted } from "vue";
import SampleApiService from "../services/SampleApiService";

interface TableItem {
  id: number;
  name: string;
  age: number;
  selected: boolean;
}

type DataList = {
  id?: string | null | undefined;
  label?: string | null | undefined;
  data?: number | null | undefined;
};

type ApiResponse = { data: DataList[] };

export default {
  setup() {
    const headers = [
      {
        text: "ID",
        value: "id",
      },
      {
        text: "日付",
        value: "label",
      },
      {
        text: "合計値",
        value: "data",
      },
    ];

    const getDay = async () => {
      const response = await SampleApiService.get();
      return response.data;
    };

    const apiResponse = reactive<ApiResponse>({ data: [] });

    const viewData = computed(() => {
      return apiResponse.data;
    });

    const displayData = async () => {
      const data = await getDay();
      apiResponse.data = data;
    };

    const dialog = ref(false);

    const selectedItems = ref<TableItem[]>([]);

    const inputNumber = ref<number>();

    const multiplication = computed(() => {
      const answer = selectedItems.value[0]?.id + 1;
      return answer;
    });

    const closeDialog = (): void => {
      dialog.value = false;
      selectedItems.value[0].id = 0;
      selectedItems.value[0].name = "";
      selectedItems.value[0].age = 0;
    };

    onMounted(async () => {
      await displayData();
    });

    return {
      selectedItems,
      inputNumber,
      headers,
      viewData,
      dialog,
      closeDialog,
      multiplication,
    };
  },
};
</script>
