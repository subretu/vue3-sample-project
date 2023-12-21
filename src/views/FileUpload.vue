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
      :color="state.snackbarColor"
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
      snackbarColor: "green",
    });

    const fileData = reactive<fileData>({
      fileUrl: [],
    });

    const timeout = ref(10000);

    const load_csv = async (event: Event) => {
      fileData.fileUrl = []

      const selectedFile = event.target;

      if (!(selectedFile instanceof HTMLInputElement)) return;
      if (selectedFile.files == null || selectedFile.files.length == 0) {
        return;
      }

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

    const uploadCsv = async () => {
      try {
        await SampleApiService.upload_csv({
          file: fileData.fileUrl,
        });
        state.isLoading = false;

        state.snackbarMessage = "Upload Success";
        state.snackbarColor = "blue";

        state.snackbar = true;
      } catch (error: any) {
        state.isLoading = false;

        state.snackbarMessage = error.response.data.message;
        state.snackbarColor = "red";

        state.snackbar = true;
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
