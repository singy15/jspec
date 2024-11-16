<script setup>
import { ref, reactive, onMounted } from 'vue'
import JspecEditor from './components/JspecEditor.vue';

const obj = reactive({
  foo: "foo1",
  biz: 123,
  bar: { 
    baz: "baz",
    fox: false,
    cat: null,
    bird: [
      1, 2, 3
    ],
    dog: undefined,
    far: 1,
    poo: {
      faz: 100
    }
  }
});

onMounted(() => {
  window.obj = obj;
})
</script>

<template>
  <JspecEditor :object="obj"/>
</template>

<style scoped>
</style>
