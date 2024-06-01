import { NextApiRequest, NextApiResponse } from "next";

export default async function createMessage(req: NextApiRequest, res: NextApiResponse) {
  const { messages, lang } = req.body;
  const apiKey = process.env.OPENAI_API_KEY;
  const url = "https://api.openai.com/v1/chat/completions";

  if (!messages && !lang) return;

  if (!apiKey) return res.status(500).json({ error: "API key is missing" });

  const body = JSON.stringify({
    messages: [
      {
        role: "user",
        content: `Can you give me 10 suggestions on ${lang} for ${messages} sub-types or synonyms, and return this sugesstions as an array of strings with JavaScript syntax, and also without anty additional characters and explanation. So, just an array. No need for extra text.`,
      },
    ],
    // CHECK VERSIONS 4
    model: "gpt-3.5-turbo-0613",
    stream: false,
  });

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body,
    });
    const data = await response.json();
    const suggestions = data.choices[0].message.content;
    // console.log(data.choices[0].message.content, "CHOICES");
    res.status(200).json({ suggestions });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
