<template>
  <div class="wrapper">
    <q-linear-progress
      v-if="isLoading"
      indeterminate
      color="primary"
      class="q-mt-md"
    />
    <q-form class="form" @submit.prevent="addCard">
      <div class="input-group">
        <q-input v-model="formField.name" label="Имя" required outlined />
      </div>
      <div class="input-group">
        <q-input
          v-model="formField.second_name"
          label="Фамилия"
          required
          outlined
        />
      </div>
      <div class="input-group">
        <q-input
          v-model.number="formField.year"
          label="Год"
          required
          outlined
        />
      </div>
      <q-btn label="Добавить карточку" type="submit" />
    </q-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useCardStore } from 'src/stores/useCards';

const cardStore = useCardStore();
const isLoading = ref<boolean>(false);

interface Card {
  name: string;
  second_name: string;
  year: number;
}

const formField = reactive<Card>({
  name: '',
  second_name: '',
  year: 0,
});

function addCard(): void {
  if (formField.name && formField.second_name && formField.year) {
    cardStore.addCard({ ...formField });
    formField.name = '';
    formField.second_name = '';
    formField.year = 0;
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 48px;
}
.cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
