import { JWT } from '@/config';
import axios from 'axios';

const service = axios.create({
  timeout: 90000,
  headers: {
    Authorization: JWT,
  },
  maxBodyLength: 100000000,
});
export default service;
