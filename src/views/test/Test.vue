<script lang="ts" setup>
import jMoment from "moment-jalaali";
import MyFullCalendar from "@/components/MyFullCalendar.vue";

const props = {
  date: "2022-09-19",
  events: [
    { id: 1, title: "All Day Event", start: "2017-02-01" },
    { id: 2, title: "Long Event", start: "2017-02-07", end: "2017-02-10" },
    { id: 3, title: "Repeating Event", start: "2017-02-09T16:00:00" },
    { id: 4, title: "Repeating Event", start: "2017-02-16T16:00:00" },
    { id: 5, title: "Conference", start: "2017-02-11", end: "2017-02-13" },
    {
      id: 6,
      title: "Meeting",
      start: "2017-02-12T10:30:00",
      end: "2017-02-12T12:30:00",
    },
    { id: 7, title: "Lunch", start: "2017-02-12T12:00:00" },
    { id: 8, title: "Meeting", start: "2017-02-12T14:30:00" },
    { id: 9, title: "Happy Hour", start: "2017-02-12T17:30:00" },
    { id: 10, title: "Dinner", start: "2017-02-12T20:00:00" },
    { id: 11, title: "Birthday Party", start: "2017-02-13T07:00:00" },
    {
      id: 12,
      title: "Click for Google",
      start: "2017-02-28",
      links: [{ link: "", title: "" }],
    },
  ],
};
</script>

<template>
  <div class="layout-content">
    <div class="content-section">
      <div class="grid">
        <div class="col-12 md:col-12 p-fluid">
          <div class="card info">
            <div class="grid">
              <div class="col-12 md:col-12 p-fluid">
                <MyFullCalendar v-bind="props"></MyFullCalendar>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
