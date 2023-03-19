import axiosInitial from 'axios';
import Survey from './components/survey/survey';
import '@/styles/main';

new Survey(document.getElementById('js-survey'));

export const axios = axiosInitial.create({
  timeout: 10000
});