<template>
  <q-linear-progress
    v-if="loading"
    indeterminate
    color="primary"
    class="q-mt-md"
  />
  <div v-else>
    <q-input
      class="my-4"
      @input="searchedUser"
      v-model="query"
      outlined
      label="Поиск"
    />
    <div v-if="!searchedUser.length">
      <h2>Ничего не найдено</h2>
    </div>
    <div v-auto-animate v-else class="cards">
      <q-card v-for="card in searchedUser" :key="card.id" class="relative">
        <q-card-section square>
          <q-menu anchor="top right" self="bottom right">
            <q-list>
              <q-item>
                <q-btn
                  class="w-full hover:bg-indigo-100"
                  label="Удалить"
                  @click="confirm = true"
                />
              </q-item>
              <q-dialog v-model="confirm" persistent>
                <q-card>
                  <q-card-section class="row items-center">
                    <span class="q-ml-sm"
                      >Вы действительно хотите удалить пользователя?</span
                    >
                  </q-card-section>
                  <q-card-actions class="row" align="center">
                    <q-btn
                      flat
                      label="Отмена"
                      color="white"
                      class="bg-green"
                      v-close-popup
                    />
                    <q-btn
                      flat
                      label="Удалить"
                      color="white"
                      class="bg-red"
                      v-close-popup
                      @click="deleteCard(card.id!)"
                    />
                  </q-card-actions>
                </q-card>
              </q-dialog>
              <q-item>
                <q-btn
                  class="w-full hover:bg-indigo-100"
                  @click="openEditDialog(card)"
                  label="Редактировать"
                />
                <q-dialog v-model="dialog">
                  <q-card class="w-1/2 p-8 relative">
                    <q-btn
                      flat
                      label="X"
                      class="absolute top-0 right-0"
                      color="primary"
                      v-close-popup
                    />
                    <q-form @submit.prevent="changeUserCard(card.id!)">
                      <q-card-section class="items-center q-pb-none text-h6">
                        <div class="input-group">
                          <q-input
                            class="w-full"
                            label="Имя"
                            v-model="validateField.name"
                            outlined
                          />
                        </div>
                      </q-card-section>

                      <q-card-section class="items-center q-pb-none text-h6">
                        <div class="input-group">
                          <q-input
                            class="w-full"
                            label="Фамилия"
                            v-model="validateField.second_name"
                            outlined
                          />
                        </div>
                      </q-card-section>
                      <q-card-section class="items-center q-pb-none text-h6">
                        <div class="input-group">
                          <q-input
                            class="w-full"
                            label="Год"
                            v-model="validateField.year"
                            outlined
                            type="number"
                          />
                        </div>
                      </q-card-section>
                      <q-card-section>
                        <q-btn type="submit" label="Отправить" />
                      </q-card-section>
                    </q-form>
                  </q-card>
                </q-dialog>
              </q-item>
            </q-list>
          </q-menu>
          <div class="absolute top-8 right-0">
            <q-btn icon="menu" flat />
          </div>
          <div>
            <p>{{ card.name }}</p>
            <p>{{ card.second_name }}</p>
            <p>{{ card.year }}</p>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCardStore } from 'src/stores/useCards';
import { onMounted, computed, ref, reactive } from 'vue';
// import debounce from 'lodash.debounce';

interface Card {
  id?: number;
  name: string;
  second_name: string;
  year: number;
}

const query = ref<string>('');

const cardStore = useCardStore();
const userCard = computed(() => cardStore.getUserCard);

const searchedUser = computed(() => {
  const normalizedQuery = query.value.trim().toLowerCase();

  return userCard.value.filter((user) => {
    const userName = user.name.trim().toLowerCase();
    const userSecondName = user.second_name.trim().toLowerCase();
    return (
      userName.includes(normalizedQuery) ||
      userSecondName.includes(normalizedQuery)
    );
  });
});

// async function searchUsers() {
//   if (query.value.trim() === '') {
//     await cardStore.fetchUserCards();
//   } else {
//     await cardStore.searchUsers(query.value);
//   }
// }

// const debouncedSearch = debounce(searchUsers, 300);
// watch(query, debouncedSearch);

const confirm = ref<boolean>(false);
const dialog = ref<boolean>(false);

const validateField = reactive({
  name: '',
  second_name: '',
  year: 0,
});

function deleteCard(id: number) {
  if (id !== undefined) {
    cardStore.deleteCard(id);
    console.log(id);
  }
}

function openEditDialog(card: Card) {
  validateField.name = card.name;
  validateField.second_name = card.second_name;
  validateField.year = card.year;
  dialog.value = true;
}

function changeUserCard(id: number) {
  if (id !== undefined) {
    cardStore.changeCardUser(id, { ...validateField });
    resetForm();
  }
}

function resetForm() {
  validateField.name = '';
  validateField.second_name = '';
  validateField.year = 0;
}

const loading = ref<boolean>(true);

async function fetchCards() {
  loading.value = true;
  await cardStore.fetchUserCards();
  loading.value = false;
}

onMounted(() => {
  fetchCards();
});
</script>

<style lang="scss" scoped>
.cards {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
