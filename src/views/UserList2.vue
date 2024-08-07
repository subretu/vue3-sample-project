<template>
  <v-container>
    <v-dialog v-model="state.dialog" width="60%" scrollable>
      <v-card title="ユーザー登録">
        <v-card-text class="pa-5">
          <v-form ref="form" v-model="valid">
            <h4 class="mb-3">基本情報</h4>
            <h5 class="mb-3">名前</h5>
            <v-row>
              <v-col cols="12" class="d-flex flex-row">
                <v-text-field
                  v-model="state.userFormData.lastName"
                  class="input-filed mr-5"
                  density="compact"
                  variant="outlined"
                  color="primary"
                  label="姓"
                  :rules="rules.lastName"
                  type="text"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="state.userFormData.firstName"
                  class="input-filed"
                  density="compact"
                  variant="outlined"
                  color="primary"
                  label="名"
                  :rules="rules.firstName"
                  type="text"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
            <h5 class="mb-3 mt-3">メールアドレス</h5>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="state.userFormData.mailAddress"
                  density="compact"
                  variant="outlined"
                  color="primary"
                  label="メールアドレス"
                  :rules="rules.mailAddress"
                  type="text"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
            <h5 class="mb-3 mt-3">所属</h5>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="state.userFormData.companyName"
                  class="input-filed2"
                  density="compact"
                  variant="outlined"
                  color="primary"
                  label="会社"
                  :rules="rules.companyName"
                  type="text"
                  required
                ></v-text-field>
              </v-col> </v-row
            ><v-divider class="mb-7 mt-3"></v-divider>
            <h4 class="mb-3">権限</h4>
            <v-row>
              <v-col cols="12" class="d-flex flex-row">
                <v-text-field
                  v-model="state.userFormData.plantName"
                  class="input-filed mr-5"
                  density="compact"
                  variant="outlined"
                  color="primary"
                  label="工場"
                  :rules="rules.plantName"
                  type="text"
                  required
                ></v-text-field>
                <v-select
                  v-model="state.userFormData.role"
                  class="input-filed"
                  variant="outlined"
                  color="primary"
                  :items="items"
                  density="compact"
                  label="権限"
                  required
                ></v-select> </v-col></v-row
          ></v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="closeDialog" variant="outlined"> キャンセル </v-btn>
          <v-btn
            @click="registerUserFormData"
            variant="elevated"
            color="primary"
            :disabled="isDisablelButton"
          >
            登録
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-row>
      <v-col>
        <v-select
          color="primary"
          v-model="tag"
          :items="tagList"
          variant="solo-filled"
          density="compact"
          class="mb-n6"
        ></v-select
      ></v-col>
      <v-spacer></v-spacer
      ><v-col cols="8" class="text-end">
        <v-btn color="primary" @click="openDialog" class="mb-n6">
          ユーザー登録
        </v-btn>
      </v-col></v-row
    >
    <v-row>
      <v-col cols="12">
        <v-sheet color="white" elevation="1">
          <v-data-table
            :headers="headers"
            :items="state.userList"
            item-value="user_id"
            @click.right.prevent="clickRow"
          >
          </v-data-table>
        </v-sheet>
      </v-col>
      <v-card
        v-if="isShow"
        v-bind:style="position"
        class="mx-auto absolute"
        max-width="300"
      >
        <v-list
          :items="contextMenuItems"
          item-title="name"
          item-value="id"
        ></v-list>
      </v-card>
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

<script setup lang="ts">
import { reactive, ref, onMounted, watch, computed } from "vue";
import SampleApiService from "../services/SampleApiService";
import { useStorage } from "@vueuse/core";

type UserList = {
  user_name: string;
  company_name: string;
  role: string;
};

type UserFormData = {
  lastName: string;
  firstName: string;
  mailAddress: string;
  companyName: string;
  plantName: string;
  role: string;
};

type State = {
  userList: UserList[];
  userFormData: UserFormData;
  dialog: boolean;
  isLoading: boolean;
  snackbar: boolean;
  snackbarMessage: string;
  snackbarColor: string;
};

type Position = {
  top: string;
  left: string;
};

const form = ref(null);
const valid = ref(false);

const state = reactive<State>({
  userList: [],
  userFormData: {
    lastName: "",
    firstName: "",
    mailAddress: "",
    companyName: "",
    plantName: "",
    role: "",
  },
  dialog: false,
  isLoading: false,
  snackbar: false,
  snackbarMessage: "",
  snackbarColor: "green",
});

const userListOriginal = ref<UserList[]>([]);

const tag = ref("");
const tagList = ref<string[]>([]);

const storedValue = useStorage("tag", tag.value);

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

const items = ["閲覧者", "操作員", "管理者"];

const contextMenuItems = [
  {
    name: "実行する",
    id: 1,
  },
];

const isShow = ref(false);

const position = reactive<Position>({
  top: "0px",
  left: "0px",
});

const rules = {
  lastName: [(v: string) => 1 <= v.trim().length || "姓を入力してください"],
  firstName: [(v: string) => 1 <= v.trim().length || "名を入力してください"],
  mailAddress: [
    (v: string) => 1 <= v.trim().length || "メールアドレスを入力してください",
  ],
  companyName: [
    (v: string) => 1 <= v.trim().length || "会社名を入力してください",
  ],
  plantName: [
    (v: string) => 1 <= v.trim().length || "工場名を入力してください",
  ],
};

const isDisablelButton = computed((): boolean => {
  return !valid.value || state.userFormData.role.trim().length === 0;
});

const getUserInfo = async () => {
  const response = await SampleApiService.get_userinfo();
  return response.data;
};

const displayData = async () => {
  const data = await getUserInfo();

  // セレクトボックスの要素を作成
  const companyNames = data.map(function (item) {
    return item.company_name;
  });
  const uniqueCompanyNames: string[] = Array.from(new Set(companyNames));
  uniqueCompanyNames.unshift("全て");
  tagList.value = uniqueCompanyNames;

  userListOriginal.value = data;
  state.userList = data;
};

const openDialog = () => {
  state.dialog = true;
};

const timeout = ref(10000);

const closeSnackbar = () => {
  state.snackbar = false;
};

const closeDialog = () => {
  state.dialog = false;
};

const registerUserFormData = async () => {
  try {
    await SampleApiService.register_user({
      data: state.userFormData,
    });
    state.isLoading = false;

    state.snackbarMessage = "Upload Success";
    state.snackbarColor = "blue";

    state.snackbar = true;

    state.dialog = false;
  } catch (error: any) {
    state.isLoading = false;

    state.snackbarMessage = error.response.data.message;
    state.snackbarColor = "red";

    state.snackbar = true;
  }
};

const filterByCompanyName = (
  data: UserList[],
  companyName: string
): UserList[] => {
  data = userListOriginal.value;
  return data.filter((user) => user.company_name === companyName);
};

const clickRow = (row: any) => {
  console.log(row.pageY + " " + row.pageX);
  //const result = confirm("今日はいい天気でしたね");
  // OKのときはtrue
  //console.log(result);
  position.top = String(row.pageY) + "px";
  position.left = String(row.pageX) + "px";
  isShow.value = true;
};

watch(state, () => {
  if (!state.dialog) {
    state.userFormData.lastName = "";
    state.userFormData.firstName = "";
    state.userFormData.mailAddress = "";
    state.userFormData.companyName = "";
    state.userFormData.plantName = "";
    state.userFormData.role = "";
  }
});

watch(tag, () => {
  storedValue.value = tag.value;
  if (tag.value === "全て") {
    state.userList = userListOriginal.value;
  } else {
    state.userList = filterByCompanyName(state.userList, tag.value);
  }
});

onMounted(async () => {
  await displayData();
  tag.value = storedValue.value;
});
</script>
<style scoped>
.input-filed {
  width: 100%;
}
.absolute {
  position: absolute;
}
</style>
>
