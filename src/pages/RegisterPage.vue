<template>
  <QCard>
    <q-card-section>
      <div class="text-h6 text-center">Регистрация</div>
    </q-card-section>
    <QCardSection>
      <QInput
        v-model="registerForm.email"
        label="Email"
        placeholder="Введите email"
        outlined
        clearable
        :rules="[
          (val) => val.length <= 50 || 'Text must be 50 characters or less',
        ]"
      />
      <div v-if="getError" class="error-message">
        {{ getError }}
      </div>

      <QInput
        v-model="registerForm.password"
        label="Пароль"
        placeholder="Введите пароль"
        type="password"
        outlined
        clearable
        :rules="[
          (val) => val.length <= 50 || 'Text must be 50 characters or less',
        ]"
      />
      <div v-if="getError" class="error-message">
        {{ getError }}
      </div>

      <div class="flex flex-center">
        <q-btn @click="register" :disable="!isFormValid">Отправить</q-btn>
      </div>
    </QCardSection>
    <QCardSection>
      <div class="flex flex-center">
        <RouterLink to="/">Войти</RouterLink>
      </div>
    </QCardSection>
  </QCard>
</template>

<script setup lang="ts">
import { ref, watch, reactive, computed } from 'vue';
import { useUserStore } from '../stores/userStore';
import { QCard, QCardSection, QInput, QBtn } from 'quasar';
import { useRouter } from 'vue-router';

const router = useRouter();
const userStore = useUserStore();

const registerForm = reactive({
  email: '',
  password: '',
});

const isFormValid = ref(false);

const getError = computed(() => userStore.getError);

function register() {
  userStore.registerUser({ ...registerForm }, (status: number) => {
    console.log('Registration status:', status);
    if (status === 201) {
      router.push({ path: '/create' });
    } else {
      console.error('Registration failed with status:', status);
    }
  });
}

watch(
  [() => registerForm.email, () => registerForm.password],
  ([email, password]) => {
    isFormValid.value = !!email && !!password;
  }
);
</script>

<style scoped>
.error-message {
  color: red;
  margin-top: 5px;
}
</style>
