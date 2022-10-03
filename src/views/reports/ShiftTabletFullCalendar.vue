<script lang="ts" setup>
import jMoment from "moment-jalaali";
import useApiErrorStore from "@/stores/api-error";
import {
  ShiftTabletFullCalendarInputModel,
  ShiftTabletFullCalendarViewModel,
} from "@/models/ReportModel";

import { Events, Event } from "@/models/MyFullCalendarModels";

const { t } = useI18n();
const toast = useToast();
const confirm = useConfirm();
const confirmGroup = uuidv4();

const apiErrorStore = useApiErrorStore();

const loading = ref(false);
const searchButtonIsLoading = ref(false);

const stateSearch = reactive({
  portal: ref<InstanceType<typeof PortalViewModel>>(),
  shiftType: ref<InstanceType<typeof ShiftTypeViewModel>>(),
  datePersian: ref(""),
});
const rulesSearch = {
  portal: { required },
  shiftType: { required },
  datePersian: { required },
};
const v$Search = useVuelidate(rulesSearch, stateSearch);

const shiftDefinitions = ref();

const shiftTypes = ref<InstanceType<typeof ShiftTypeViewModel>[]>([
  { id: 0, title: t("shift.type.all") },
  { id: 1, title: t("shift.type.regie") },
  { id: 2, title: t("shift.type.coordinator") },
]);

const portals = ref<InstanceType<typeof PortalViewModel>[]>();
const portalService = ref(new PortalService());

const events = ref<Events>([]);
const shiftTabletFullCalendars =
  ref<InstanceType<typeof ShiftTabletFullCalendarViewModel>[]>();
const reportService = ref(new ReportService());

const eventClass = (event: any) => {
  if (
    event.meta.shiftTabletId > 0 &&
    event.meta.crewCount >= event.meta.templateCount
  ) {
    return "event-title-ok";
  } else if (
    event.meta.shiftTabletId > 0 &&
    event.meta.crewCount < event.meta.templateCount
  ) {
    return "event-title-warning";
  } else {
    return "event-title-nok";
  }
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
          shiftTypeId: v$Search.value.shiftType.$model?.id,
        })
      )
    ).data;

    shiftDefinitions.value = [
      ...new Map(
        shiftTabletFullCalendars.value.map((item) => [
          item["title"],
          { title: item.title, templateCount: item.templateCount },
        ])
      ).values(),
    ];

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

    v$Search.value.shiftType.$model = shiftTypes.value[0];
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
                    <Dropdown
                      id="shiftType"
                      v-model="v$Search.shiftType.$model"
                      :options="shiftTypes"
                      option-label="title"
                      :show-clear="true"
                      :class="{
                        'p-invalid': v$Search.shiftType.$invalid,
                      }"
                      ><template #empty>
                        {{ t("dropdown.slot.empty") }}
                      </template></Dropdown
                    >

                    <label for="shiftType">{{ t("shiftType.title") }}</label>
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
                <div class="grid">
                  <div
                    v-for="(shiftDefinition, index) in shiftDefinitions"
                    :key="index"
                    class="col shift-base-class"
                  >
                    {{ shiftDefinition.title }} ({{
                      shiftDefinition.templateCount
                    }})
                  </div>
                </div>

                <div class="grid">
                  <div class="col">&nbsp;</div>
                </div>

                <MyFullCalendar
                  v-slot="slotProps"
                  :loading="loading"
                  :date="v$Search.datePersian.$model"
                  :events="events"
                >
                  <div class="shift-type-event">
                    <span
                      v-for="(event, eventIndex) in slotProps.events.filter(
                        (x) => x.meta.shiftTypeId == 1
                      )"
                      :key="eventIndex"
                    >
                      <div class="event-title" :class="eventClass(event)">
                        {{ event.title }}
                        <span v-if="event.meta.shiftTabletId > 0">
                          ({{ event.meta.crewCount }})
                        </span>
                      </div>
                    </span>
                  </div>

                  <div class="shift-type-event">
                    <span
                      v-for="(event, eventIndex) in slotProps.events.filter(
                        (x) => x.meta.shiftTypeId == 2
                      )"
                      :key="eventIndex"
                    >
                      <div class="event-title" :class="eventClass(event)">
                        {{ event.title }}
                        <span v-if="event.meta.shiftTabletId > 0">
                          ({{ event.meta.crewCount }})
                        </span>
                      </div>
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
