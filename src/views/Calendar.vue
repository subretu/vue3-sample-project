<template>
  <v-container>
    <v-row>
      <v-col>
        <div>
          <ScheduleXCalendar :calendar-app="calendarApp" />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ScheduleXCalendar } from "@schedule-x/vue";
import {
  createCalendar,
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
} from "@schedule-x/calendar";
import "@schedule-x/theme-default/dist/index.css";

// Do not use a ref here, as the calendar instance is not reactive, and doing so might cause issues
// For updating events, use the events service plugin
const calendarApp = createCalendar({
  selectedDate: "2025-02-16",
  views: [
    createViewDay(),
    createViewWeek(),
    createViewMonthGrid(),
    createViewMonthAgenda(),
  ],
  events: [
    {
      id: 1,
      title: "Event 1",
      start: "2025-02-16",
      end: "2025-02-16",
    },
    {
      id: 2,
      title: "Event 2",
      start: "2025-02-16 13:00",
      end: "2025-02-16 14:00",
    },
  ],
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
