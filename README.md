# Chatbot UI

![Chatbot UI](./public/screenshot.png)

A simple chatbot starter kit for OpenAI's chat model using Next.js, TypeScript, and Tailwind CSS.

## Features

Chatbot UI provides a simple, fully-functional chat interface that you can use to start building your own chatbot apps powered by OpenAI.

Modify the chat interface in `components/Chat`.

Tweak the system prompt in `utils/index.ts`.

Tweak the assistant prompt in `pages/index.tsx`.

## Running Locally

**1. Clone Repo**

```bash
git clone https://github.com/mckaywrigley/chatbot-ui.git
```

**2. Install Dependencies**

```bash
npm i
```

**3. Provide OpenAI API Key**

Create a .env.local file in the root of the repo with your OpenAI API Key:

```bash
OPENAI_API_KEY=<YOUR_KEY>
```

**4. Run app**

```bash
npm run dev
```

**5. Start building**

You should be able to start chatting with the bot.

Now, go build the app into whatever kind of chatbot you want!

**6. Optional**

Search for `DELETE BRANDING` to quickly find and remove the branding in `Navbar.tsx` and `Footer.tsx`.

## Contact

If you have any questions, feel free to reach out to me on [Twitter](https://twitter.com/mckaywrigley)!
