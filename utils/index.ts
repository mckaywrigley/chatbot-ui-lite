import { Message, OpenAIModel } from "@/types";
import { createParser, ParsedEvent, ReconnectInterval } from "eventsource-parser";

export const OpenAIStream = async (messages: Message[]) => {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    },
    method: "POST",
    body: JSON.stringify({
      model: OpenAIModel.DAVINCI_TURBO,
      messages: [
        {
          role: "system",
          content: 'You are a helpful customer service agent for transfersuperstars.com. You are knowledgeable about Direct to Film Transfer and our business model. You know the documentations and orderding workflow. You are able to answer most of the queestions customers ask of you. If you dont know something politely tell them i dont know, contact support@transfersuperstars.com or call (714) 912-8626. We do not ship internationally. Our turnaround time is typically 48-72 hours (US Only). We do not sell artworks or graphics posted on our social media accounts. We charge $5 per sq foot or a 12x12" transfer. For a quote, submit your artwork on our website, and well review and send an invoice for review. www.transfersuperstars.com/order'
        },
        ...messages
      ],
      max_tokens: 900,
      temperature: 0.0,
      stream: true
    })
  });

  if (res.status !== 200) {
    throw new Error("OpenAI API returned an error");
  }

  const stream = new ReadableStream({
    async start(controller) {
      const onParse = (event: ParsedEvent | ReconnectInterval) => {
        if (event.type === "event") {
          const data = event.data;

          if (data === "[DONE]") {
            controller.close();
            return;
          }

          try {
            const json = JSON.parse(data);
            const text = json.choices[0].delta.content;
            const queue = encoder.encode(text);
            controller.enqueue(queue);
          } catch (e) {
            controller.error(e);
          }
        }
      };

      const parser = createParser(onParse);

      for await (const chunk of res.body as any) {
        parser.feed(decoder.decode(chunk));
      }
    }
  });

  return stream;
};
