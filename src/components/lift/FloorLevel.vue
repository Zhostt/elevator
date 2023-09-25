<template>
  <label class="level" for="level">
    <input type="radio" name="level" :value="level" v-model="internalValue" />
    <span>{{ level }}</span>
  </label>
</template>

<script lang="ts" setup>
import { inject, defineProps } from "vue";
// Это компонент этажа
interface Props {
  level: number;
}
defineProps<Props>();
// Получаем номер этажа от родителя
const internalValue = inject("level");
</script>
<style>
.level {
  display: flex;
  gap: 4px;
  align-items: center;
  box-sizing: border-box;
  border: 0.01px solid palevioletred;
  height: 100px;
}
</style>
