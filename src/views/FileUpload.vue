<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-sheet color="white" elevation="1" class="pa-2">
          <v-row>
            <v-col>
              <p>
                <input type="file" accept="text/csv" @change="load_csv" />
              </p> </v-col
            ><v-col
              ><v-btn variant="tonal" @click="displayLoading">
                Upload
              </v-btn></v-col
            >
          </v-row>
        </v-sheet>
      </v-col>
    </v-row>
    <v-snackbar v-model="state.snackbar" :timeout="timeout" color="primary"
      >{{ state.snackbarMessage }}
      <template v-slot:actions>
        <v-btn variant="text" @click="state.snackbar = false"> Close </v-btn>
      </template>
    </v-snackbar>
    <v-overlay
      :model-value="state.isLoading"
      :persistent="true"
      class="align-center justify-center"
    >
      <v-progress-circular indeterminate color="primary" :size="64" />
    </v-overlay>
  </v-container>
</template>

<script lang="ts">
import { reactive, ref } from "vue";

export default {
  setup() {
    const state = reactive({
      isLoading: false,
      snackbar: false,
      snackbarMessage: "",
    });

    const timeout = ref(3000);

    const load_csv = async (event: Event) => {
      const selectedFile = event.target;

      if (!(selectedFile instanceof HTMLInputElement)) return;
      if (selectedFile.files == null || selectedFile.files.length == 0) {
        return;
      }

      // 読み込んだCSVファイルを配列に変換
      const files = await Promise.all(
        Array.from(selectedFile.files).map(async (f) =>
          parseCSV(await f.text())
        )
      );

      console.log(files);

      selectedFile.value = "";
    };

    const parseCSV = (data: string) => {
      return data.split("\r\n").map((row) => row.split(","));
    };

    const sleep = async (ms: number) =>
      new Promise((res) => setTimeout(res, ms));

    const displayLoading = async () => {
      state.snackbarMessage = "";

      state.isLoading = true;
      await sleep(2000);
      state.isLoading = false;

      state.snackbarMessage = "Upload Success";
      state.snackbar = true;
    };

    return {
      state,
      timeout,
      load_csv,
      displayLoading,
    };
  },
};
</script>
