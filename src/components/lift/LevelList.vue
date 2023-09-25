<template>
    <div class="level-list">
        <slot></slot>
    </div>
</template>

<script lang="ts" setup>
import {
  provide, ref, watch, defineEmits,
} from 'vue';

const emits = defineEmits(['change']);

const internalValue = ref(null);
// тоже не масшабируется если будет больше одного компонента
provide('level', internalValue);

watch(internalValue, (value) => emits('change', value));
</script>

<style>
.level-list {
    display: flex;
    flex-direction: column;
}
</style>
