<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-sheet color="white" elevation="1" class="pa-2">
          <v-row>
            <v-col>
              <p>
                <input type="file" accept="text/csv" @change="load_csv" />
              </p>
            </v-col>
          </v-row>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { reactive } from "vue";

export default {
  setup() {
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

    return {
      load_csv,
    };
  },
};
</script>
