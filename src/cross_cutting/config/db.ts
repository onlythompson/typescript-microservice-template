import { APP_CONFIG } from './app';

export const DB_CONFIG = {
  mongodb_uri: APP_CONFIG.mongoUri,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  },
};