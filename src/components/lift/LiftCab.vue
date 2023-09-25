<template>
  <div :style="computedShift" :class="{ 'lift-cab': true, blinking: isBlinking }">
    <div class="lift-display">
      <p>{{ targetFloor }}</p>
      <p>{{ direction }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, defineEmits, defineProps, ref } from "vue";
import { wait } from "../../utils";

export interface CabProps {
  shift: number;
  time: number;
  targetFloor: number;
  direction: string;
}
// На вход пропсом получает CabState из очереди в liftBase
// Готовится эмитить событие cab-ready
const props = defineProps<CabProps>();
const emits = defineEmits(["cab-ready"]);

// Реактивная величина-стиль для кабинки лифта,
// Делает нам анимацию
const computedShift = computed(() => ({
  transform: `translateY(${props.shift}px)`,
  transition: `transform ${props.time}s ease-out`,
}));

// Остановка лифта и мигание
const isBlinking = ref(false);
const toggleBlink = () => {
  isBlinking.value = !isBlinking.value;
};

// Лифт останавливается - ждет и мигает 3 сек,
// Потом эмитит cab-ready
async function onLiftStop() {
  toggleBlink();
  await wait(3000);
  toggleBlink();
  emits("cab-ready");
}
// На всем компоненте висит слшутаель, ждет конца анимации,
// Колбэк - onLiftStop (выше)
onMounted(() => {
  // eslint-disable-next-line no-restricted-globals
  addEventListener("transitionend", () => {
    onLiftStop();
  });
});
// Убираем слушатель при размонтировании компонента
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
  border: 2px solid black;
  position: absolute;
}

.blinking {
  animation: blink-animation 0.3s steps(3, start) infinite;
}

.lift-display {
  text-align: center;
  height: 50%;
  font-size: 1.2rem;
}

.target-floor {
  border-bottom: 2px solid black;
}

@keyframes blink-animation {
  to {
    visibility: hidden;
  }
}
</style>
