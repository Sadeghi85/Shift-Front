<script lang="ts" setup>
import jMoment from "moment-jalaali";

import { Event, Events } from "@/models/MyFullCalendarModels";

interface MyFullCalendarProps {
  events: Events | undefined;
  date: string;
  loading: boolean;
}

const props = defineProps<MyFullCalendarProps>();
//const emit = defineEmits(["updateIsDone", "insertIsDone", "cuIsCanceled"]);

// events:
// [
//     {"id": 1,"title": "All Day Event","start": "2017-02-01"},
//     {"id": 2,"title": "Long Event","start": "2017-02-07","end": "2017-02-10"},
//     {"id": 3,"title": "Repeating Event","start": "2017-02-09T16:00:00"},
//     {"id": 4,"title": "Repeating Event","start": "2017-02-16T16:00:00"},
//     {"id": 5,"title": "Conference","start": "2017-02-11","end": "2017-02-13"},
//     {"id": 6,"title": "Meeting","start": "2017-02-12T10:30:00","end": "2017-02-12T12:30:00"},
//     {"id": 7,"title": "Lunch","start": "2017-02-12T12:00:00"},
//     {"id": 8,"title": "Meeting","start": "2017-02-12T14:30:00"},
//     {"id": 9,"title": "Happy Hour","start": "2017-02-12T17:30:00"},
//     {"id": 10,"title": "Dinner","start": "2017-02-12T20:00:00"},
//     {"id": 11,"title": "Birthday Party","start": "2017-02-13T07:00:00"},
//     {"id": 12,"title": "Click for Google","url": "https://www.google.com/","start": "2017-02-28"}
// ]

const today = ref(jMoment());
const startMonth = ref(jMoment());
const endMonth = ref(jMoment());
const startCalendar = ref(jMoment());
const endCalendar = ref(jMoment());
const calendarDiff = ref(0);

const calendarDays = ref<Array<jMoment.Moment>>([]);
const calendarWeeks = ref<Array<Array<jMoment.Moment>>>([]);

const dayClass = (day: jMoment.Moment) => {
  if (today.value.jMonth() == day.jMonth()) {
    return "current-month";
  } else {
    return "other-month";
  }
};

const dayEvents = (day: jMoment.Moment) => {
  const _events = [...(props.events ?? [])].sort((a, b) => {
    return a.id - b.id;
  });

  return _events.filter((event) => {
    return jMoment(event.start).date() == day.date();
  });
};

const render = (props: any) => {
  today.value = jMoment(props.date, "jYYYY/jMM/jDD");
  startMonth.value = today.value.clone().startOf("jMonth");
  endMonth.value = today.value.clone().endOf("jMonth");
  // day() starts from 0:sunday, we want 0:saturday, hence the -1
  startCalendar.value = startMonth.value
    .clone()
    .add(-startMonth.value.day() - 1, "day");
  endCalendar.value = endMonth.value
    .clone()
    .add(6 - endMonth.value.day() - 1, "day");

  const calendarDiff = endCalendar.value.diff(startCalendar.value, "days") + 1;

  calendarDays.value = [];
  calendarWeeks.value = [];

  for (let i = 0; i < calendarDiff; i++) {
    calendarDays.value.push(startCalendar.value.clone().add(i, "day"));

    if (i % 7 == 6) {
      calendarWeeks.value.push(calendarDays.value);
      calendarDays.value = [];
    }
  }
};

watch(
  () => props,
  (newProps, oldProps) => {
    console.log(newProps);

    if (newProps.date && newProps.events && newProps.loading == false) {
      render(newProps);
    }
  },
  { immediate: true, deep: true }
);
</script>
<template>
  <div class="layout-content">
    <div class="content-section">
      <div class="grid">
        <div class="col-12 md:col-12 p-fluid">
          <div class="card info">
            <div class="grid">
              <div class="col-12 md:col-12 p-fluid">
                <div class="fc_container">
                  <div v-if="props.loading" class="fc_overlay">
                    <span class="pi pi-spinner" style="font-size: 6rem"></span>
                  </div>
                  <div class="fc_component">
                    <table
                      style="
                        width: 100%;
                        border-spacing: 0;
                        border-collapse: collapse;
                        border: 1px solid #ddd;
                        table-layout: fixed;
                      "
                    >
                      <thead>
                        <tr style="background-color: #f8f9fa">
                          <th
                            style="
                              border: 1px solid #ddd;
                              margin: 0;
                              padding: 0;
                            "
                          >
                            <div>شنبه</div>
                          </th>
                          <th
                            style="
                              border: 1px solid #ddd;
                              margin: 0;
                              padding: 0;
                            "
                          >
                            <div>یک‌شنبه</div>
                          </th>
                          <th
                            style="
                              border: 1px solid #ddd;
                              margin: 0;
                              padding: 0;
                            "
                          >
                            <div>دوشنبه</div>
                          </th>
                          <th
                            style="
                              border: 1px solid #ddd;
                              margin: 0;
                              padding: 0;
                            "
                          >
                            <div>سه‌شنبه</div>
                          </th>
                          <th
                            style="
                              border: 1px solid #ddd;
                              margin: 0;
                              padding: 0;
                            "
                          >
                            <div>چهارشنبه</div>
                          </th>
                          <th
                            style="
                              border: 1px solid #ddd;
                              margin: 0;
                              padding: 0;
                            "
                          >
                            <div>پنج‌شنبه</div>
                          </th>
                          <th
                            style="
                              border: 1px solid #ddd;
                              margin: 0;
                              padding: 0;
                            "
                          >
                            <div>جمعه</div>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="(calendarWeek, weekIndex) in calendarWeeks"
                          :key="weekIndex"
                        >
                          <td
                            v-for="(calendarDay, dayIndex) in calendarWeek"
                            :key="dayIndex"
                            style="
                              border: 1px solid #ddd;
                              margin: 0;
                              padding: 0;
                            "
                          >
                            <div style="min-height: 120px">
                              <div :class="dayClass(calendarDay)">
                                <a style="padding: 4px">{{
                                  calendarDay.jDate()
                                }}</a>
                              </div>
                              <div class="event-content">
                                <span
                                  v-for="(event, eventIndex) in dayEvents(
                                    calendarDay
                                  )"
                                  :key="eventIndex"
                                >
                                  <slot
                                    :event="event"
                                    :eventIndex="eventIndex"
                                  ></slot>
                                </span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>today: {{ today.format("jYYYY/jMM/jDD") }}</div>
                <div>
                  start of month: {{ startMonth.format("jYYYY/jMM/jDD") }}
                </div>
                <div>end of month: {{ endMonth.format("jYYYY/jMM/jDD") }}</div>
                <div>
                  start of calendar: {{ startCalendar.format("jYYYY/jMM/jDD") }}
                </div>
                <div>
                  end of calendar: {{ endCalendar.format("jYYYY/jMM/jDD") }}
                </div>
                <ul>
                  <li
                    v-for="calendarDay in calendarDays"
                    :key="calendarDay.dayOfYear"
                  >
                    {{ calendarDay.format("jYYYY/jMM/jDD") }}
                  </li>
                </ul>
                <div>{{ calendarDiff }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.fc_container {
  display: grid;
}
.fc_component,
.fc_overlay {
  grid-area: 1 / 1;
}
.fc_overlay {
  z-index: 100000;
  background-color: rgba(250, 250, 250, 0.75);
  justify-items: center;
  align-items: center;
  display: inline-grid;
}

.event-content {
  padding: 5px 0 5px 0;
}

.current-month {
  color: black;
}

.other-month {
  color: darkgray;
}
</style>
