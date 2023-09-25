<template>
  <div :style="computedShift" :class="{ 'lift-cab': true, blinking: isBlinking }">
    {{ shift }}
  </div>
</template>

<script lang="ts" setup>
import {
  computed,
  onMounted,
  onUnmounted,
  defineEmits,
  withDefaults,
  defineProps,
  ref,
} from "vue";
import { wait } from "../../utils";

export interface CabProps {
  shift: number;
  time: number;
}

const proprs = withDefaults(defineProps<CabProps>(), {
  shift: 0,
  time: 1,
});
const emits = defineEmits(["cab-ready"]);
const computedShift = computed(
  () =>
    // eslint-disable-next-line implicit-arrow-linebreak
    ({
      transform: `translateY(${proprs.shift}px)`,
      transition: `transform ${proprs.time}s ease-out`,
    } as Record<string, any>)
);

// Остановка лифта и мигание
const isBlinking = ref(false);
const toggleBlink = () => {
  isBlinking.value = !isBlinking.value;
};
async function onLiftStop() {
  toggleBlink();
  await wait(3000);
  toggleBlink();
  emits("cab-ready");
}

onMounted(() => {
  // eslint-disable-next-line no-restricted-globals
  addEventListener("transitionend", () => {
    onLiftStop();
  });
});
onUnmounted(() => {
  // eslint-disable-next-line no-restricted-globals
  removeEventListener("transitionend", onLiftStop);
});
</script>

<style>
.lift-cab {
  height: 100px;
  width: 80px;
  background-color: aquamarine;
  position: absolute;
}

.blinking {
  animation: blink-animation 0.3s steps(3, start) infinite;
}
@keyframes blink-animation {
  to {
    visibility: hidden;
  }
}
</style>
