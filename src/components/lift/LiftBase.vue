<template>
  <div class="lift">
    <LiftCab
      :shift="cabState.shift"
      :time="cabState.time"
      :targetFloor="cabState.targetFloor"
      :direction="cabState.direction"
      @cab-ready="onReady"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, defineProps } from "vue";
import LiftCab, { CabProps } from "./LiftCab.vue";

interface Props {
  nextFloor: number;
}
// Пропсами из Building liftBase получает следующий вызванный этаж
const props = defineProps<Props>();

// Высота этажа для расчета сдвига кабины лифта
const FLOOR_HEIGHT = 100;
// Перечисление возможных статусов лифта
enum LiftState {
  idle,
  run,
}
// Состояние лифта - индекс в очереди вызовов, пред вызванный этаж
// И статус лифта (едет, стоит)
let queueIndex = 0;
let previousFloor = 1;
let liftState: LiftState = LiftState.idle;

// очередь вызвов (со всем для анимации, это пропс для кабины - cabState ниже)
const queue = ref<CabProps[]>([]);
// То что будет лежать в очереди выше, объект для анимации
const cabState = ref<CabProps>({
  shift: 0,
  time: 1,
  targetFloor: props.nextFloor,
  direction: "idle", // Начинаем с состояния "idle"
});
// функция обработки следующего этажа во все данные для анимации кабины
// Сдвиг, время анимации, целевой этаж, направление движения
function dataTransform(nextFloor: number) {
  // Пляски чтобы высчитывать сдвиг с предыдущей позиции (а не от изначальной)
  const prevPosition = -(previousFloor * FLOOR_HEIGHT - FLOOR_HEIGHT);
  const shift = prevPosition + (previousFloor - nextFloor) * FLOOR_HEIGHT;
  // Время из расчета по секунде на этаж
  const time = Math.abs(previousFloor - nextFloor);

  // Направление движения
  let direction;
  if (nextFloor > previousFloor) {
    direction = "up";
  } else if (nextFloor < previousFloor) {
    direction = "down";
  } else if (nextFloor === previousFloor) {
    direction = "idle";
  }
  console.log("shift", shift);
  console.log("previousFloor", previousFloor);
  console.log("nextFloor", nextFloor);
  console.log("time", time);

  // Запоминаем нынешний этаж как предыдущий
  previousFloor = nextFloor;

  // Возвращаем данные для кабинки
  return { shift, time, targetFloor: nextFloor, direction };
}

// Добавление в очередь вызовов для кабинки объекта с данными
// для анимации
function putInqueue(nextFloor: number) {
  const data = dataTransform(nextFloor);
  queue.value.push(data);
}
// Наблюдаем за пропсом из ElevatorBuilding, если он меняется - добавляем новый в очередь
// В виде объекта cabState для анимации
watch(
  () => props.nextFloor,
  (nextFloor) => {
    putInqueue(nextFloor);
  }
);
// Когда кабинка останавливается - выдает событие cab-ready
// Его ловит обработчик и выполняет эту фию.
// Берет следующий объект для анимации из очереди
// И подставляет его в cabState, после чего передает в кабинку
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

// Наблюдатель за очередью
// Если очередь меняется и лифт еще не едет - врубаем его
// В cabState кидаем обект из очереди по индексу
// И увеличиваем индекс для перебора очереди
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
