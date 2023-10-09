<template>
  <v-container>
    <v-row>
      <v-col cols="10">
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
  </v-container>
</template>

<script lang="ts">
import { reactive, onMounted } from "vue";
import SampleApiService from "../services/SampleApiService";

type UserList = {
  userName: string;
  companyName: string;
};

type state = { userList: UserList[]; expanded: [] };

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

    const state = reactive<state>({ userList: [], expanded: [] });

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

    onMounted(async () => {
      await displayData();
      getUserInfo();
    });

    return {
      headers,
      state,
      createDisplayExpandData,
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
