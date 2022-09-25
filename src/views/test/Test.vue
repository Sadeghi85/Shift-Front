<!-- <script lang="ts" setup>

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
</script> -->

<script lang="ts" setup>
import jMoment from "moment-jalaali";
import useApiErrorStore from "@/stores/api-error";
import {
  ShiftTabletFullCalendarInputModel,
  ShiftTabletFullCalendarViewModel,
} from "@/models/ReportModel";

import { Events, Event } from "@/models/MyFullCalendarModels";

// const props = {
//   date: "2022-09-19",
//   events: [
//     { id: 1, title: "All Day Event", start: "2017-02-01" },
//     { id: 2, title: "Long Event", start: "2017-02-07", end: "2017-02-10" },
//     { id: 3, title: "Repeating Event", start: "2017-02-09T16:00:00" },
//     { id: 4, title: "Repeating Event", start: "2017-02-16T16:00:00" },
//     { id: 5, title: "Conference", start: "2017-02-11", end: "2017-02-13" },
//     {
//       id: 6,
//       title: "Meeting",
//       start: "2017-02-12T10:30:00",
//       end: "2017-02-12T12:30:00",
//     },
//     { id: 7, title: "Lunch", start: "2017-02-12T12:00:00" },
//     { id: 8, title: "Meeting", start: "2017-02-12T14:30:00" },
//     { id: 9, title: "Happy Hour", start: "2017-02-12T17:30:00" },
//     { id: 10, title: "Dinner", start: "2017-02-12T20:00:00" },
//     { id: 11, title: "Birthday Party", start: "2017-02-13T07:00:00" },
//     {
//       id: 12,
//       title: "Click for Google",
//       start: "2017-02-28",
//       links: [{ link: "", title: "" }],
//     },
//   ],
// };

const { t } = useI18n();
const toast = useToast();
const confirm = useConfirm();
const confirmGroup = uuidv4();

const apiErrorStore = useApiErrorStore();

const loading = ref(true);
const searchButtonIsLoading = ref(false);

const stateSearch = reactive({
  portal: ref<InstanceType<typeof PortalViewModel>>(),
  datePersian: ref(""),
});
const rulesSearch = {
  portal: { required },
  datePersian: { required },
};
const v$Search = useVuelidate(rulesSearch, stateSearch);

//const agents = ref<InstanceType<typeof AgentViewModel>[]>();
//const agentService = ref(new AgentService());

const portals = ref<InstanceType<typeof PortalViewModel>[]>();
const portalService = ref(new PortalService());

const shiftTablets = ref<InstanceType<typeof ShiftTabletViewModel>[]>();
const shiftTabletService = ref(new ShiftTabletService());

const events = ref<Events>();
const shiftTabletFullCalendars =
  ref<InstanceType<typeof ShiftTabletFullCalendarViewModel>[]>();
const reportService = ref(new ReportService());

const eventClass = (event: any) => {
  console.log(event);
  if (
    event.meta.templateCount > 0 &&
    event.meta.crewCount >= event.meta.templateCount
  ) {
    return "event-title-ok";
  } else if (
    event.meta.templateCount > 0 &&
    event.meta.crewCount < event.meta.templateCount
  ) {
    return "event-title-warning";
  } else {
    return "event-title-nok";
  }

  // if (event.meta.shiftTabletId == 0 || event.meta.templateCount == 0) {
  //   return "event-title-nok";
  // } else if (
  //   event.meta.templateCount > 0 &&
  //   event.meta.crewCount < event.meta.templateCount
  // ) {
  //   return "event-title-warning";
  // } else {
  //   return "event-title-ok";
  // }
};

async function loadShiftTabletFullCalendar() {
  try {
    loading.value = true;

    if (v$Search.value.$invalid) {
      loading.value = false;
      return;
    }

    shiftTabletFullCalendars.value = (
      await reportService.value.getShiftTabletFullCalendar(
        new ShiftTabletFullCalendarInputModel({
          datePersian: v$Search.value.datePersian.$model,
          portalId: v$Search.value.portal.$model?.id,
        })
      )
    ).data;

    events.value = shiftTabletFullCalendars.value.map(
      (s: ShiftTabletFullCalendarViewModel) => {
        return {
          id: s.id,
          start: s.shiftDate,
          title: s.title,
          meta: s,
        } as Event;
      }
    );

    // if (!searchParams) {
    //   searchParams = new PaymentSearchModel({
    //     portalId: v$Search.value.portal.$model?.id,
    //     datePersian: v$Search.value.datePersian.$model,
    //     pageNo: pageNumber.value,
    //     pageSize: pageSize.value,
    //     orderKey: "id",
    //     desc: true,
    //     isDeleted: false,
    //   });
    // }

    // const paymentResponse = await shiftTabletService.value.getAll(searchParams);

    // payments.value = paymentResponse.data;
    // totalRecords.value = paymentResponse.totalCount;

    loading.value = false;
  } catch (error: any) {
    loading.value = false;

    if (typeof error.message === "object") {
      apiErrorStore.setApiErrorMessage(error.message.message);
    } else {
      console.log(error.message);
    }
  }
}

const handleSearch = async () => {
  searchButtonIsLoading.value = true;

  if (v$Search.value.$invalid) {
    searchButtonIsLoading.value = false;
    return;
  }

  await loadShiftTabletFullCalendar();

  searchButtonIsLoading.value = false;
};

const loadEssentials = async () => {
  try {
    // portals
    portals.value = (
      await portalService.value.getAll(new PortalSearchModel({}))
    ).data;

    if (portals.value.length > 0) {
      v$Search.value.portal.$model = portals.value[0];
    }

    v$Search.value.datePersian.$model = jMoment().format("jYYYY/jMM/01");

    await handleSearch();
  } catch (error: any) {
    if (typeof error.message === "object") {
      apiErrorStore.setApiErrorMessage(error.message.message);
    } else {
      console.log(error.message);
    }
  }
};

// lifecycle hooks
onMounted(async () => {
  await loadEssentials();
});
</script>

<template>
  <div class="layout-content">
    <div class="content-section">
      <div class="grid">
        <div class="col-12 md:col-12 p-fluid">
          <div class="card">
            <form
              class="p-fluid"
              autocomplete="off"
              @submit.prevent="handleSearch()"
            >
              <div class="grid formgrid">
                <div class="field col-12 mb-4 md:col-3">
                  <div class="p-float-label">
                    <Dropdown
                      id="portal"
                      v-model="v$Search.portal.$model"
                      :options="portals"
                      option-label="title"
                      :filter="true"
                      :show-clear="true"
                      :class="{ 'p-invalid': v$Search.portal.$invalid }"
                      ><template #empty>
                        {{ t("dropdown.slot.empty") }}
                      </template></Dropdown
                    >

                    <label for="portal">{{ t("portal.title") }}</label>
                  </div>
                </div>
                <div class="field col-12 mb-4 md:col-3">
                  <div class="p-float-label">
                    <PersianDatePicker
                      v-model="v$Search.datePersian.$model"
                      :input-class="
                        v$Search.datePersian.$invalid
                          ? 'p-inputtext p-component p-invalid'
                          : 'p-inputtext p-component '
                      "
                      format="jYYYY/jMM/01"
                      display-format="jMMMM jYYYY"
                      type="year-month"
                      :clearable="true"
                      :auto-submit="true"
                      :popover="true"
                    />
                  </div>
                </div>

                <div class="field col-12 mb-4 md:col-2">
                  <Button
                    type="submit"
                    :label="t('button.search')"
                    :loading="searchButtonIsLoading"
                    class="p-button-primary"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <div class="content-section">
      <div class="grid">
        <div class="col-12 md:col-12 p-fluid">
          <div class="card info">
            <div class="grid">
              <div class="col-12 md:col-12 p-fluid">
                <MyFullCalendar
                  v-slot="slotProps"
                  :loading="loading"
                  :date="v$Search.datePersian.$model"
                  :events="events"
                >
                  <div class="event-title" :class="eventClass(slotProps.event)">
                    {{ slotProps.event.title }}
                    <span v-if="slotProps.event.meta.templateCount > 0">
                      ({{ slotProps.event.meta.templateCount }})
                      {{ slotProps.event.meta.crewCount }}
                    </span>
                  </div>
                </MyFullCalendar>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.event-title {
  padding: 1px;
  margin: 1px;
  font-size: 0.85em;
  border-radius: 3px;
}

.event-title-ok {
  background-color: #54c354;
  border: 1px solid #13bd13;
  color: #eee;
}
.event-title-nok {
  background-color: #e46464;
  border: 1px solid #d22020;
  color: #eee;
}

.event-title-warning {
  background-color: rgb(255 227 118);
  border: 1px solid rgb(230 183 1);
  color: #777;
}
</style>
