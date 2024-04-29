<template>
  <v-app>
    <v-app-bar color="primary" dark app clipped-left>
        <v-tabs>
          <v-tab to="/userlist">USERLIST</v-tab>
          <v-tab to="/fileupload">FILEUPLOAD</v-tab>
          <v-tab to="/userlist2">USERLIST2</v-tab>
        </v-tabs>
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>
