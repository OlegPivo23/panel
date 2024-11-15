import { defineStore } from 'pinia';
import axiosR from 'src/api/http';
import Card from 'src/interfaces/card';

export const useCardStore = defineStore('cardStore', {
  state: () => ({
    userCard: [] as Card[],
    isFetching: false,
  }),

  getters: {
    getUserCard(state) {
      return state.userCard;
    },
  },

  actions: {
    async fetchUserCards() {
      if (this.userCard.length > 0) {
        console.log('Данные взяты из кэша');
        return;
      }

      this.isFetching = true;
      try {
        const res = await axiosR.get('/cards');
        this.userCard = res.data;
        console.log('Данные загружены с сервера', res);
      } catch (error) {
        console.error('Ошибка при загрузке карточек:', error);
      } finally {
        this.isFetching = false;
      }
    },

    async searchUsers(query: string) {
      try {
        const response = await axiosR.get(`/cards?name=${query}`);
        this.userCard = response.data;
      } catch (error) {
        console.error('Ошибка при поиске пользователей:', error);
      }
    },

    addCard(card: Card) {
      axiosR.post('/cards', card).then((res) => {
        this.userCard.push(res.data);
      });
    },

    deleteCard(id: number) {
      axiosR.delete(`/cards/${id}`).then(() => {
        this.userCard = this.userCard.filter((card) => card.id !== id);
      });
    },

    changeCardUser(id: number, card: Card) {
      axiosR
        .patch(`/cards/${id}`, card)
        .then((res) => {
          const index = this.userCard.findIndex((c) => c.id === id);
          if (index !== -1) {
            this.userCard[index] = res.data;
          }
        })
        .catch((error) => {
          console.error('Ошибка при обновлении карточки:', error);
        });
    },
  },
});
