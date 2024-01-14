<template>
  <v-container>
    <v-dialog v-model="state.dialog" width="900" scrollable>
      <v-card>
        <v-card-title class="headline">CSV Upload </v-card-title>
        <v-card-text class="pa-5">
          <v-row>
            <v-col cols="10">
              <p>
                <v-file-input
                  label="ファイルを選択"
                  @change="load_csv"
                  v-model="state.files"
                ></v-file-input>
              </p> </v-col
            ><v-col cols="2"
              ><v-btn
                variant="tonal"
                class="mt-3"
                @click="displayLoading"
                :disabled="state.isDisablelButton"
              >
                Upload
              </v-btn></v-col
            >
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-row
      ><v-col cols="10"></v-col
      ><v-col cols="2">
        <div class="text-end">
          <v-btn
            class="ml-2 truncate ml-auto"
            variant="tonal"
            @click="openDialog"
          >
            CSV Upload
          </v-btn>
        </div></v-col
      ></v-row
    >
    <v-row>
      <v-col cols="12">
        <v-sheet color="white" elevation="1">
          <v-data-table
            :headers="headers"
            :items="state.userList"
            item-value="user_id"
            show-expand
            v-model:expanded="state.expanded"
            expand-on-click
          >
            <template v-slot:expanded-row="{ columns, item }">
              <tr>
                <td :colspan="columns.length" class="expand-data">
                  {{ createDisplayExpandData(item.role) }}
                </td>
              </tr>
            </template>
          </v-data-table>
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
        <v-btn variant="text" @click="closeSnackbar"> Close </v-btn>
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
import { reactive, ref, onMounted, watch } from "vue";
import SampleApiService from "../services/SampleApiService";

type UserList = {
  userName: string;
  companyName: string;
};

type state = {
  userList: UserList[];
  expanded: [];
  dialog: boolean;
  isLoading: boolean;
  snackbar: boolean;
  snackbarMessage: string;
  snackbarColor: string;
  isDisablelButton: boolean;
  files: [];
};

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
    const headers = [
      {
        title: "ユーザー名",
        key: "user_name",
      },
      {
        title: "会社",
        key: "company_name",
      },
    ];

    const state = reactive<state>({
      userList: [],
      expanded: [],
      dialog: false,
      isLoading: false,
      snackbar: false,
      snackbarMessage: "",
      snackbarColor: "green",
      isDisablelButton: true,
      files: [],
    });

    const getUserInfo = async () => {
      const response = await SampleApiService.get_userinfo();
      return response.data;
    };

    const displayData = async () => {
      const data = await getUserInfo();
      state.userList = data;
    };

    const createDisplayExpandData = (role: any) => {
      let result = "";

      for (const key in role) {
        result += "・" + key + ":　" + role[key] + "\n";
      }
      return result;
    };

    const openDialog = () => {
      state.dialog = true;
    };

    const fileData = reactive<fileData>({
      fileUrl: [],
    });

    const timeout = ref(10000);

    const load_csv = async (event: Event) => {
      fileData.fileUrl = [];

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

          state.isDisablelButton = false;
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

        state.dialog = false;
        state.isDisablelButton = true;
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

    const closeSnackbar = () => {
      state.snackbar = false;
    };

    watch(state, () => {
      if (!state.dialog) {
        state.isDisablelButton = true;
        state.files = [];
      }
      if (state.files.length == 0 && state.dialog) {
        state.isDisablelButton = true;
      }
    });

    onMounted(async () => {
      await displayData();
      getUserInfo();
    });

    return {
      headers,
      state,
      createDisplayExpandData,
      openDialog,
      timeout,
      load_csv,
      displayLoading,
      closeSnackbar,
    };
  },
};
</script>
<style scoped>
.expand-data {
  white-space: break-spaces;
  font-size: 14px;
}
</style>
