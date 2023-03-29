<template>
  <v-container>
    <h3>UserList</h3>
    {{ items.length }}件
    <v-row>
      <v-col cols="10">
        <v-sheet color="white" elevation="1">
          <v-data-table :headers="headers" :items="items"> </v-data-table>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  setup() {
    const headers = [
      {
        title: "ID",
        key: "id",
      },
      {
        title: "名前",
        key: "name",
      },
      {
        title: "年齢",
        key: "age",
      },
    ];
    const items = [
      {
        id: 1,
        name: "高田健志",
        age: 33,
      },
      {
        id: 2,
        name: "横山緑",
        age: 42,
      },
      {
        id: 4,
        name: "山崎イチゴ",
        age: 12,
      },
      {
        id: 5,
        name: "山田ニゴ",
        age: 16,
      },
      {
        id: 6,
        name: "山本一之進",
        age: 12,
      },
    ];
    return {
      headers,
      items,
    };
  },
};
</script>
