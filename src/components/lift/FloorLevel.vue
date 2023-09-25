<template>
  <label class="level" for="level">
    <input type="radio" name="level" :value="level" v-model="internalValue" />
    <span>{{ level }}</span>
  </label>
</template>

<script lang="ts" setup>
import { inject, defineProps } from "vue";

interface Props {
  level: number;
}
defineProps<Props>();

const internalValue = inject("level");
</script>
<style>
.level {
  display: flex;
  gap: 4px;
  align-items: center;
  border: 1px solid palevioletred;
  height: 100px;
}
</style>
