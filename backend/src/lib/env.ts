import {envSchema} from "@/config/envs";

const env = envSchema.parse(process.env);
export {env};