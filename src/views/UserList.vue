<template>
  <v-container>
    <v-row>
      <v-col cols="10">
        <v-sheet color="white" elevation="1">
          <v-data-table
            show-select
            :headers="headers"
            :items="state.userList"
            item-value="id"
            :single-select="false"
          >
          </v-data-table>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { reactive, onMounted } from "vue";
import SampleApiService from "../services/SampleApiService";

type DataList = {
  id?: string | null | undefined;
  label?: string | null | undefined;
  data?: number | null | undefined;
};

type state = { userList: DataList[] };

export default {
  setup() {
    const headers = [
      {
        title: "ID",
        key: "id",
      },
      {
        title: "日付",
        key: "label",
      },
      {
        title: "合計値",
        key: "data",
      },
    ];

    const state = reactive<state>({ userList: [] });

    const getDay = async () => {
      const response = await SampleApiService.get();
      return response.data;
    };

    const displayData = async () => {
      const data = await getDay();
      state.userList = data;
    };

    onMounted(async () => {
      await displayData();
    });

    return {
      headers,
      state,
    };
  },
};
</script>
