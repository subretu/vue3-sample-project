<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-sheet color="white" elevation="1" class="pa-2">
          <v-row>
            <v-col>
              <p>
                <v-file-input
                  label="ファイルを選択"
                  @change="load_csv"
                ></v-file-input>
              </p> </v-col
            ><v-col
              ><v-btn variant="tonal" class="mt-3" @click="displayLoading">
                Upload
              </v-btn></v-col
            >
          </v-row>
        </v-sheet>
      </v-col>
    </v-row>
    <v-snackbar
      v-model="state.snackbar"
      :timeout="timeout"
      color="green"
      location="top right"
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
import SampleApiService from "../services/SampleApiService";

type fileData = {
  fileUrl: string[];
};

const get_data_url = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const result = reader.result;
      if (typeof result === "string") {
        resolve(result);
      } else {
        reject(new Error("not string"));
      }
    });
    reader.readAsDataURL(file);
  });
};

export default {
  setup() {
    const state = reactive({
      isLoading: false,
      snackbar: false,
      snackbarMessage: "",
    });

    const fileData = reactive<fileData>({
      fileUrl: [],
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

      // CSVをBase64エンコード
      for (let i = 0; i < selectedFile.files.length; i++) {
        try {
          const result = await get_data_url(selectedFile.files[i]);
          fileData.fileUrl.push(result);
        } catch (e) {
          alert(`ERROR: ${e}`);
        }
      }

      selectedFile.value = "";
    };

    const parseCSV = (data: string) => {
      return data.split("\r\n").map((row) => row.split(","));
    };

    const uploadCsv = async () => {
      try {
        await SampleApiService.upload_csv({
          file: fileData.fileUrl,
        });
        state.isLoading = false;
        state.snackbarMessage = "Upload Success";
        state.snackbar = true;
        console.log("Post OK");
      } catch (error) {
        state.isLoading = false;
        state.snackbarMessage = "Upload Error";
        state.snackbar = true;
        console.log("error");
      }
    };

    const displayLoading = async () => {
      state.snackbarMessage = "";

      state.isLoading = true;

      await uploadCsv();
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
