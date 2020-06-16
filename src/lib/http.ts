import axios, {AxiosError, AxiosRequestConfig, AxiosResponse} from 'axios';
import {env} from '../config';

interface ErrorData {
  errors: string[];
}

const http = axios.create({
  baseURL: env.baseURL,
});

function onResponseSuccess(response: AxiosResponse) {
  const {data} = response;

  return data;
}

function onResponseError(error: AxiosError) {
  const message = parseErrorMessage(error.response as AxiosResponse<ErrorData>);
  if (message) {
    error.message = message;
  } else {
    error.message =
      'Sorry, no Internet connectivity detected. Please reconnect and try again.';
  }
  return Promise.reject(error);
}

function onRequestSuccess(config: AxiosRequestConfig): AxiosRequestConfig {
  config.headers = {...config.headers};

  return config;
}

function parseErrorMessage(errResponse: AxiosResponse<ErrorData>): string {
  return errResponse && errResponse.data ? errResponse.data.errors[0] : '';
}

http.interceptors.request.use(onRequestSuccess);
http.interceptors.response.use(onResponseSuccess, onResponseError);

export {http};
