<template>
  <main class="building">
    <h1>Здание. Выбран этаж номер {{ selectedLevel ? selectedLevel : "_" }}</h1>
    <h3>Стек вызовов этажей {{ levelStack }}</h3>
    <section class="building__lift">
      <LiftBase :next-floor="selectedLevel" />
      <LevelList class="building__levels" @change="onLevelChange">
        <FloorLevel :level="level" v-for="level of computedFloorNum" :key="level" />
      </LevelList>
    </section>
  </main>
</template>

<script lang="ts" setup>
import { computed, ref, withDefaults, defineProps } from "vue";
import { LevelList, FloorLevel, LiftBase } from "./lift";

interface Props {
  floorNum: number;
}
// Пропсы на вход, дефолт 5 этажей
const props = withDefaults(defineProps<Props>(), {
  floorNum: 5,
});

const selectedLevel = ref<number>(0); // Текущий этаж, передадим в LiftBase как next-floor
const levelStack = ref<number[]>([]); // Очередь вызовов

// Собираем номера этажей в нужном порядке (снизу вверх) для отрисовки в v-for
const computedFloorNum = computed(() =>
  Array(props.floorNum)
    .fill(null)
    .map((_el, index) => props.floorNum - index)
);

// Обработка выбора этажа кнопкой
function onLevelChange(level: number) {
  selectedLevel.value = level; // меняем текущий этаж на переданный
  levelStack.value.push(level); // Добавляем переданный в очередь
}
</script>

<style>
.building {
  background-color: aqua;
  width: 100%;
  height: 100%;
  max-height: 100vh;
  padding: 4px;
}

.building__lift {
  display: flex;
  justify-content: stretch;
  align-items: flex-end;
  border: 1px solid palevioletred;
}

.building__levels {
  flex-grow: 1;
}
</style>
