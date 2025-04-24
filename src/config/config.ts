const config = {
  port: process.env.PORT || 8080,
  env: process.env.NODE_ENV || "development",
  db_url: process.env.MONGODB_URI,
  hf_api_key: process.env.HUGGINGFACE_API_KEY,
};

export default config;
