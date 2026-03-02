## How to get an OpenAI API Key

To get an OpenAI API key, follow these steps:

1. **Sign Up / Log In**: Go to the OpenAI platform at [platform.openai.com](https://platform.openai.com/) and create an account or log in.
2. **Access API Keys**: On the left sidebar, click on **"API keys"** (it has a little key icon).
3. **Generate Key**: Click the **"+ Create new secret key"** button. Give it a name like "Zubi Project" and click Create.
4. **Copy the Key**: It will show you a long string starting with `sk-...`. **Copy this immediately**, as you won't be able to see it again!
5. **Add Billing (Required for use)**: OpenAI requires a minimum balance of $5 or so to activate the API. Go to **Settings > Billing** on the left sidebar to add a payment method and load a small amount of credits.

Once you have copied the `sk-...` key, paste it into your `c:\Zubi\backend\.env` file next to `OPENAI_API_KEY=`, save the file, and then restart your backend terminal (`npm start`). Let me know when you've got it working!
