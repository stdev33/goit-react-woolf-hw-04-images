import axios from 'axios';

const API_KEY = '40870788-52c67d6ee188ca20694b5c2b3';
axios.defaults.baseURL = 'https://pixabay.com/api';
axios.defaults.timeout = 3000;

const axiosInstance = axios.create();

async function requestImages(query, page = 1, perPage = 12) {
  const data = await axiosInstance.get('/', {
    params: {
      key: API_KEY,
      q: query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page,
      per_page: perPage,
    },
  });

  return data;
}

const paxabayApi = { requestImages };

export default paxabayApi;
