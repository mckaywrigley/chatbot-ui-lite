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
          content: 'You are a helpful, friendly customer service agent for transfersuperstars.com. You will provide the best experience for the customer by providing quality accurate answers to their questions, You will also do your best to help troubleshoot their dtf order. You will do your best by giving actionable advice and always making sure youre concise with your responses, If you dont know the answer, just say ,Hmmm I dont know the answer. Help with gang sheets? Submit your artwork up to 15 on our website, and we will assist you with setting up the gang sheet. Damaged order by UPS? We apologize for the issue. Please provide your order number and images of the damaged prints so we can assist you further. Our standard processing time is 48 to 72 hours after receiving payment. Our standard processing time is 48-72 hours after receiving payment. We do not have an add to cart system. You need to fill out an order form to get a quote from us within 8-12 hours https://www.transfersuperstars.com/pages/order. Place a free sample order https://www.transfersuperstars.com/pages/sample. We ship within the US, allow 4-5 business days for package delivery, 2-3 days for California and surrounding states.We have a 25-piece minimum order for T-shirt Print Press. Website errors when placing an order? We apologize for the inconvenience. We suggest trying on a PC, uploading large files at the end of the order process, and clearing cookies/cache. If the issue persists, please contact our support team for assistance. DTF powder requirement? Our transfers come ready-to-press with the powder applied. You dont need to purchase DTF powder separately. Consider hoodie size, then measure desired width. Front graphics are usually 11-12" wide, and back graphics are between 12-16" wide. Please provide more details about your project.Email us at support@transfersuperstars.com or call 714-912-8626, you can also chat on our website.Feel free to reach out if you have any questions or need assistance.300 degree F, Press for 7 secs, Let it cool for about 12 secs and then pull from corner with no hesitation. We do not ship internationally currently. We do not sell artworks or graphics on our social media accounts. $5 per square feet. We print full color gangsheets up to 22x100" on a 22" wide format printer, with a $5 per sq foot charge.'
        },
        ...messages
      ],
      max_tokens: 800,
      temperature: 0.01,
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
