<template>
  <v-container>
    <v-dialog v-model="state.dialog" width="1200" scrollable>
      <v-card title="ユーザー登録">
        <v-card-text class="pa-5">
          <v-form v-model="valid">
            <h4 class="mb-3">基本情報</h4>
            <h5 class="mb-3">姓名</h5>
            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-model="state.userFormData.lastName"
                  label="姓"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="state.userFormData.firstName"
                  label="名"
                ></v-text-field
              ></v-col>
            </v-row>
            <h5 class="mb-3">所属</h5>
            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-model="state.userFormData.companyName"
                  label="会社"
                ></v-text-field>
              </v-col> </v-row
            ><v-divider class="mb-5"></v-divider>
            <h4 class="mb-3">権限</h4>
            <v-row>
              <v-col cols="6">
                <v-text-field  v-model="state.userFormData.plantName" label="工場"></v-text-field
              ></v-col>
              <v-col cols="6">
                <v-text-field  v-model="state.userFormData.role" label="権限"></v-text-field></v-col></v-row
          ></v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="insert" variant="tonal"> キャンセル </v-btn>
          <v-btn @click="insert" variant="tonal" color="success"> 登録 </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-row
      ><v-col cols="10"></v-col
      ><v-col cols="2">
        <div class="text-end">
          <v-btn
            class="ml-2 truncate ml-auto"
            variant="outlined"
            @click="openDialog"
          >
            ユーザー登録
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
          >
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
  role: string;
};

type UserFormData = {
  lastName: string;
  firstName: string;
  companyName: string;
  plantName: string;
  role: string;
};

type state = {
  userList: UserList[];
  userFormData: UserFormData;
  dialog: boolean;
  isLoading: boolean;
  snackbar: boolean;
  snackbarMessage: string;
  snackbarColor: string;
  isDisablelButton: boolean;
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
      userFormData: {
        lastName: "",
        firstName: "",
        companyName: "",
        plantName: "",
        role: "",
      },
      dialog: false,
      isLoading: false,
      snackbar: false,
      snackbarMessage: "",
      snackbarColor: "green",
      isDisablelButton: true,
    });

    const getUserInfo = async () => {
      const response = await SampleApiService.get_userinfo();
      return response.data;
    };

    const displayData = async () => {
      const data = await getUserInfo();
      state.userList = data;
    };

    const openDialog = () => {
      state.dialog = true;
    };

    const timeout = ref(10000);

    const displayLoading = async () => {
      state.snackbarMessage = "";

      state.isLoading = true;
    };

    const closeSnackbar = () => {
      state.snackbar = false;
    };

    const closeDialog = () => {
      state.dialog = false;
    };

    watch(state, () => {
      if (!state.dialog) {
        state.isDisablelButton = true;
      }
      if (state.dialog) {
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
      openDialog,
      timeout,
      displayLoading,
      closeSnackbar,
      closeDialog,
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
