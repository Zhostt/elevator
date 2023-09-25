<template>
  <div class="lift">
    <LiftCab :shift="cabState.shift" :time="cabState.time" @cab-ready="onReady" />
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, defineProps } from "vue";
import LiftCab, { CabProps } from "./LiftCab.vue";

interface Props {
  nextFloor: number;
}

const props = defineProps<Props>();

const FLOOR_HEIGHT = 100;
enum LiftState {
  idle,
  run,
}
let queueIndex = 0;
let previousFloor = 1;
let liftState: LiftState = LiftState.idle;

const queue = ref<CabProps[]>([]);
const cabState = ref<CabProps>({ shift: 0, time: 1 });

function dataTransform(nextFloor: number) {
  const prevPosition = -(previousFloor * FLOOR_HEIGHT - FLOOR_HEIGHT);
  const shift = prevPosition + (previousFloor - nextFloor) * FLOOR_HEIGHT;
  const time = Math.abs(previousFloor - nextFloor);

  console.log("shift", shift);
  console.log("previousFloor", previousFloor);
  console.log("nextFloor", nextFloor);
  console.log("time", time);

  previousFloor = nextFloor;

  return { shift, time };
}

function putInqueue(nextFloor: number) {
  const data = dataTransform(nextFloor);
  queue.value.push(data);
}

watch(
  () => props.nextFloor,
  (nextFloor) => {
    putInqueue(nextFloor);
  }
);

function onReady() {
  console.warn("ready");
  const nextElInQueue = queue.value[queueIndex];

  if (nextElInQueue !== undefined) {
    cabState.value = nextElInQueue;
    queueIndex += 1;
  } else {
    liftState = LiftState.idle;
  }
}

watch(
  queue,
  () => {
    if (liftState === LiftState.run) {
      return;
    }

    liftState = LiftState.run;
    cabState.value = queue.value[queueIndex];
    queueIndex += 1;
  },
  { deep: true }
);
</script>

<style>
.lift {
  position: relative;
  height: 100px;
  width: 80px;
}
</style>
