<template>
  <div class="level-list">
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import { provide, ref, watch, defineEmits } from "vue";

// Будем эмитить change
const emits = defineEmits(["change"]);

const internalValue = ref(null);
provide("level", internalValue);
// internalValue передаем в ребенка (список этажей), следим за его изменениями
// Это номер этажа
watch(internalValue, (value) => emits("change", value));
</script>

<style>
.level-list {
  display: flex;
  flex-direction: column;
}
</style>
