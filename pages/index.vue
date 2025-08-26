<script lang="ts" setup>
import type { ParentChildCenterReservation } from "~/services/taipei/@types";

const coords = ref<{ longitude: number; latitude: number }>();

const { data: reservations_today } = await useFetch<
  ParentChildCenterReservation[]
>(`/api/taipei/reservations?shortcut=today`);

const { data: reservations_tomorrow } = await useFetch<
  ParentChildCenterReservation[]
>(`/api/taipei/reservations?shortcut=tomorrow`);

const { data: reservations_thisWeekendSat } = await useFetch<
  ParentChildCenterReservation[]
>(`/api/taipei/reservations?shortcut=this-weekend-sat`);

const { data: reservations_thisWeekendSun } = await useFetch<
  ParentChildCenterReservation[]
>(`/api/taipei/reservations?shortcut=this-weekend-sun`);

const { data: reservations_nextWeekendSat } = await useFetch<
  ParentChildCenterReservation[]
>(`/api/taipei/reservations?shortcut=next-weekend-sat`);

const { data: reservations_nextWeekendSun } = await useFetch<
  ParentChildCenterReservation[]
>(`/api/taipei/reservations?shortcut=next-weekend-sun`);

onMounted(async () => {
  if (!navigator.geolocation) {
  } else {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        coords.value = position.coords;
      },
      () => {}
    );
  }
});
</script>

<template>
  <HorizontalCardList :data-source="reservations_today" :coords>
    <template #title> 今天 </template>
  </HorizontalCardList>
  <HorizontalCardList :data-source="reservations_tomorrow" :coords>
    <template #title> 明天 </template>
  </HorizontalCardList>
  <HorizontalCardList :data-source="reservations_thisWeekendSat" :coords>
    <template #title> 這周末 - 禮拜六 </template>
  </HorizontalCardList>
  <HorizontalCardList :data-source="reservations_thisWeekendSun" :coords>
    <template #title> 這周末 - 禮拜日 </template>
  </HorizontalCardList>
  <HorizontalCardList :data-source="reservations_nextWeekendSat" :coords>
    <template #title> 下周末 - 禮拜六 </template>
  </HorizontalCardList>
  <HorizontalCardList :data-source="reservations_nextWeekendSun" :coords>
    <template #title> 下周末 - 禮拜日 </template>
  </HorizontalCardList>
</template>

<style lang="scss" scoped></style>
