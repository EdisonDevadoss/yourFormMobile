const defaultEnv = {
  baseURL: 'https://chatbot-api.herokuapp.com/',
};
const devEnv = {};
const prodEnv = {};

const env =
  process.env.NODE_ENV === 'production'
    ? {...defaultEnv, ...prodEnv}
    : {...defaultEnv, ...devEnv};

export default env;
