<template>
  <div class="wrapper">
    <div class="cards flex flex-col gap-4 cursor-grab">
      <q-card
        v-for="card in cards"
        :key="card.id"
        v-drag
        @dragstart="onDragStart(card)"
        draggable="true"
        class="card"
      >
        <q-card-section square> {{ card.name }} </q-card-section>
      </q-card>
    </div>
    <ul class="list grid grid-cols-4 gap-8 drop-target">
      <li
        v-for="(task, index) in tasks"
        :key="index"
        class="bg-slate-200 h-48 flex flex-col items-center justify-center"
        @dragover.prevent
        @drop="onDrop(task)"
      >
        <div class="task-name">{{ task.name }}</div>
        <div class="task-items">
          <q-list>
            <q-card class="p-4" v-for="(item, itemIndex) in task.items" :key="itemIndex">
              <q-section square>
                {{ item.name }}
              </q-section>
            </q-card>
          </q-list>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, Ref } from 'vue';

interface Card {
  id: number;
  name: string;
}

interface Task {
  name: string;
  items: Card[];
}

const cards: Ref<Card[]> = ref([
  { id: 1, name: 'Карточка 1' },
  { id: 2, name: 'Карточка 2' },
  { id: 3, name: 'Карточка 3' },
  { id: 4, name: 'Карточка 4' },
  { id: 5, name: 'Карточка 5' },
]);

const tasks: Ref<Task[]> = ref([
  { name: 'Задача 1', items: [] },
  { name: 'Задача 2', items: [] },
  { name: 'Задача 3', items: [] },
  { name: 'Задача 4', items: [] },
]);

const draggedCard: Ref<Card | null> = ref(null);

function onDragStart(card: Card): void {
  draggedCard.value = card;

}

function onDrop(task: Task): void {
  if (draggedCard.value) {
    task.items.push(draggedCard.value);
    cards.value = cards.value.filter((c) => c.id !== draggedCard.value!.id);
    draggedCard.value = null;
  }
}
</script>

<style scoped lang="scss">
.wrapper {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 30px;
}

.card {
  cursor: grab;
}

.drop-target {
  border: 1px dashed #ccc;
  padding: 1rem;
  border-radius: 8px;
  transition: background-color 0.3s;
}

.task-name {
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.task-items {
  list-style-type: none;
  padding: 0;
}
</style>
