<script lang="ts" setup>
import dayjs from "dayjs";
import type { ParentChildCenterReservation } from "~/services/taipei/@types";
import { getDistanceFromLatLonInKm } from "~/util";

type Props = {
  coords?: { longitude: number; latitude: number };
  dataSource?: ParentChildCenterReservation[] | null;
};

const props = withDefaults(defineProps<Props>(), {
  dataSource: () => [],
});

const list = computed(() =>
  props.dataSource
    ?.map((x) => ({
      ...x,
      distance: props.coords
        ? getDistanceFromLatLonInKm(x.coords, props.coords)
        : 0,
    }))
    .sort((a, b) => a.distance - b.distance)
    .map((x) => ({ ...x, distance: x.distance.toFixed(2) }))
);
</script>

<template>
  <div class="p-4 pr-0" v-show="props.dataSource?.length">
    <div class="text-2xl">
      <slot name="title" />
    </div>
    <div
      class="grid overflow-auto gap-2 p-4"
      :style="{
        gridTemplateColumns: `repeat(${
          props.dataSource?.length ?? '0'
        }, 180px)`,
      }"
    >
      <VarCard
        v-for="item in list"
        :title="item.text"
        :subtitle="item.area.text"
      >
        <VarChip>{{ dayjs(item.startsAt).format("HH:mm") }} 場次</VarChip>
        <div class="pt-2">尚有 {{ item.amount }} 名額</div>
      </VarCard>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
