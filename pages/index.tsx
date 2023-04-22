import { Chat } from "@/components/Chat/Chat";
import { Footer } from "@/components/Layout/Footer";
import { Navbar } from "@/components/Layout/Navbar";
import { Message } from "@/types";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { OpenAI } from "langchain/llms/openai";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanChatMessage, SystemChatMessage } from "langchain/schema";
import { LLMChain } from "langchain/chains";
import {
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
  ChatPromptTemplate,
} from "langchain/prompts";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { CharacterTextSplitter } from "langchain/text_splitter";

const key = "ENTER KEY HERE";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chat = new ChatOpenAI({ openAIApiKey: key, temperature: 0.7 })
  const assistantPrompt = ChatPromptTemplate.fromPromptMessages([
    SystemMessagePromptTemplate.fromTemplate(
      "You are a helpful AI assistant. This is the history of your conversation so far: {history}"
    ),
    HumanMessagePromptTemplate.fromTemplate("{text}"),
  ]);
  const chain = new LLMChain({
    prompt:assistantPrompt,
    llm: chat,
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async (message: Message) => {
    const updatedMessages = [...messages, message];

    setMessages(updatedMessages);
    setLoading(true);

    let messageHistory = "";
    for (let i = 0; i < updatedMessages.length; i++) {
      messageHistory = messageHistory.concat(`${updatedMessages[i].role}: ${updatedMessages[i].content}; `)
    }
    if (localStorage.getItem("history") !== null){
      const contextInjection = await handleLoad(message.content);
      messageHistory = messageHistory.concat(String(contextInjection));
    }
    const response = await chain.call({history: messageHistory, text: message.content});

    let isFirst = true;
    setLoading(true);

      if (isFirst) {
        isFirst = false;
        setMessages((messages) => [
          ...messages,
          {
            role: "assistant",
            content: response.text
          }
        ]);
        setLoading(false);
      } else {
        setMessages((messages) => {
          const lastMessage = messages[messages.length - 1];
          const updatedMessage = {
            ...lastMessage,
            content: lastMessage.content + response
          };
          setLoading(false);
          return [...messages.slice(0, -1), updatedMessage];
        });
      }
    }

  const handleReset = () => {
    setMessages([
      {
        role: "assistant",
        content: `Hi there! I'm Chatbot UI, an AI assistant. I can help you with things like answering questions, providing information, and helping with tasks. How can I help you?`
      }
    ]);
  };

  const handleSave = () => {
    if (localStorage.getItem("history") === null){
      let messageHistory:string;
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const dateString = `~// ON YEAR-${year} MONTH-${month} DAY-${day}:`;
      messageHistory = `${dateString}: `; 
      for (let i = 0; i < messages.length; i++) {
        messageHistory = messageHistory.concat(`${messages[i].role}: ${messages[i].content}; `)
      }
      localStorage.setItem("history", messageHistory);
      //console.log(localStorage.getItem("history"))
    }
    else {
      let messageHistory:string;
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const dateString = `~// ON YEAR-${year} MONTH-${month} DAY-${day}:`;
      messageHistory = String(localStorage.getItem("history"));
      messageHistory = messageHistory.concat(`${dateString}: `); 
      for (let i = 0; i < messages.length; i++) {
        messageHistory = messageHistory.concat(`${messages[i].role}: ${messages[i].content}; `)
      }
      localStorage.setItem("history", messageHistory);
    }
    
  };

  const handleLoad = async (message:string) => {
    if (localStorage.getItem("history") !== null){
      const messageHistory:string = String(localStorage.getItem("history"));
      const splitter = new CharacterTextSplitter({separator: "~// ON "});
      const output = await splitter.createDocuments([messageHistory]);
      const vectorStore = await MemoryVectorStore.fromDocuments(
        output,
        new OpenAIEmbeddings({openAIApiKey: key})
      );
      const results = await vectorStore.similaritySearch(message, 5);
      let resultConcat = "";
      for (let i = 0; i < results.length; i++) {
        resultConcat = resultConcat.concat(`${results[i].pageContent};`)
      }
      return resultConcat
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        content: `Hi there! I'm Chatbot UI, an AI assistant. I can help you with things like answering questions, providing information, and helping with tasks. How can I help you?`
      }
    ]);
  }, []);

  return (
    <>
      <Head>
        <title>Chatbot UI</title>
        <meta
          name="description"
          content="A simple chatbot starter kit for OpenAI's chat model using Next.js, TypeScript, and Tailwind CSS."
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <link
          rel="icon"
          href="/favicon.ico"
        />
      </Head>

      <div className="flex flex-col h-screen">
        <Navbar />

        <div className="flex-1 overflow-auto sm:px-10 pb-4 sm:pb-10">
          <div className="max-w-[800px] mx-auto mt-4 sm:mt-12">
            <Chat
              messages={messages}
              loading={loading}
              onSend={handleSend}
              onReset={handleReset}
              onSave={handleSave}
            />
            <div ref={messagesEndRef} />
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
  }
