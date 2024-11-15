<template>
  <QCard>
    <q-card-section>
      <div class="text-h6 text-center">Вход</div>
    </q-card-section>
    <QCardSection>
      <QInput
        v-model.lazy="loginForm.email"
        label="Имя"
        placeholder="Введите имя"
        outlined
        clearable
        :rules="[
          (val) =>
            (val && val.length <= 50) || 'Text must be 50 characters or less',
        ]"
      />
      <div v-if="getError" class="error-message">
        {{ getError.message }}
      </div>

      <QInput
        v-model.lazy="loginForm.password"
        label="Пароль"
        placeholder="Введите пароль"
        outlined
        clearable
        :rules="[
          (val) =>
            (val && val.length <= 50) || 'Text must be 50 characters or less',
        ]"
      />
      <div v-if="getError" class="error-message">
        {{ getError.message }}
      </div>

      <div class="flex flex-center">
        <q-btn @click="login" :disabled="!isFormField">отправить</q-btn>
      </div>

      <q-linear-progress
        v-if="isLoading"
        indeterminate
        color="primary"
        class="q-mt-md"
      />
    </QCardSection>
    <QCardSection>
      <div class="flex flex-center">
        <RouterLink to="/register">Регистрация</RouterLink>
      </div>
    </QCardSection>
  </QCard>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, reactive, computed } from 'vue';
import { useUserStore } from '../stores/userStore';
import { QCard, QCardSection, QInput, QBtn, QLinearProgress } from 'quasar';
import { useRouter } from 'vue-router';

const router = useRouter();
const userStore = useUserStore();

const loginForm = reactive({
  email: '',
  password: '',
});

const isFormField = ref<boolean>(false);
const isLoading = ref<boolean>(false);

const user = computed(() => userStore.getUser);
const getError = computed(() => userStore.getError);

watch(
  [() => loginForm.email, () => loginForm.password],
  ([newEmail, newPassword]) => {
    isFormField.value = !!newEmail && !!newPassword;
  }
);

async function login() {
  isLoading.value = true;
  console.log('Попытка входа:', loginForm);

  await userStore.login({
    email: loginForm.email,
    password: loginForm.password,
  });

  isLoading.value = false;

  if (user.value) {
    router.push({ path: '/create' });
  } else if (getError.value) {
    console.error('Ошибка входа:', getError.value);
  }
}

onMounted(() => {
  console.log(user.value);
});
</script>
