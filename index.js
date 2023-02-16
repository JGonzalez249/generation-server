import { Configuration, OpenAIApi } from "openai";
import {config} from 'dotenv';
config()

const configuration = new Configuration({
    // organization: "org-HgBUl1nua3IBuDMkH8dYQLZJ",
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const response = await openai.createCompletion({
  model: "text-davinci-003",
  prompt: process.argv[2],
  max_tokens: 100,
  temperature: 0,
});
console.log(response.data.choices[0].text)