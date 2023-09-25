<template>
    <main class="building">
      <h1>Здание. Выбран этаж номер {{ selectedLevel ? selectedLevel : '_' }}</h1>
      <h3>Стек вызовов этажей {{ levelStack }}</h3>
      <section class="building__lift">
        <LiftBase
        :next-floor="selectedLevel"
         />
        <LevelList class="building__levels" @change="onLevelChange">
          <FloorLevel :level="level" v-for="(level) of computedFloorNum" :key="level"/>
        </LevelList>
      </section>
    </main>
  </template>

<script lang="ts" setup>
import {
  computed, ref, withDefaults, defineProps,
} from 'vue';
import { LevelList, FloorLevel, LiftBase } from './lift';

interface Props {
  floorNum: number
}

// Получаем пропсы количества этажей, дефолт 5
const props = withDefaults(defineProps<Props>(), {
  floorNum: 5,
});

const selectedLevel = ref<number>(0); // Выбранный этаж
const levelStack = ref<number[]>([]); // Очередь вызовов этажей
// Перевернутый массив с номерами этажей
const computedFloorNum = computed(() => Array(props.floorNum)
  .fill(null)
  .map((_el, index) => props.floorNum - index));

// Изменение этажа
function onLevelChange(level: number) {
  selectedLevel.value = level;
  levelStack.value.push(level);
}
</script>

  <style>
  .building {
    background-color: aqua;
    width: 100%;
    height: 100%;
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
