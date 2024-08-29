export const EXTERNAL_SERVICES_CONFIG = {
    email: {
      service: process.env.EMAIL_SERVICE || 'smtp',
      host: process.env.EMAIL_HOST || 'smtp.example.com',
      port: parseInt(process.env.EMAIL_PORT || '587', 10),
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    },
    payment: {
      gateway: process.env.PAYMENT_GATEWAY || 'stripe',
      apiKey: process.env.PAYMENT_API_KEY,
      webhookSecret: process.env.PAYMENT_WEBHOOK_SECRET,
    },
    storage: {
      provider: process.env.STORAGE_PROVIDER || 'aws',
      aws: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION || 'us-east-1',
        bucket: process.env.AWS_S3_BUCKET,
      },
    },
  };