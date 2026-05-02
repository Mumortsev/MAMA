"use server";

export type ChatMessage = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

const BASE_SYSTEM_PROMPT = ``;

export async function sendMessageToGigaChat(messages: ChatMessage[], memories: string[]) {
  // Игнорируем проблемы с самоподписанными сертификатами GigaChat
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

  const memoryContext = memories.length > 0 
    ? `\n\nДОПОЛНИТЕЛЬНЫЕ ВОСПОМИНАНИЯ (сохраненные ранее):\n${memories.map(m => '- ' + m).join('\n')}`
    : '';

  const systemMessage: ChatMessage = {
    role: 'system',
    content: BASE_SYSTEM_PROMPT + memoryContext
  };

  const payload = [systemMessage, ...messages];

  try {
    // 1. Получение токена
    const authString = "MDE5YzVjNmEtODJkYy03YmI3LWI5NzItYjMwYmE5YmE3MmNiOjNmOWRlMzAzLTNlZTItNGNjOS1iN2ZiLTVhYTlhNjdiZjg0Mw==";
    const authParams = new URLSearchParams();
    authParams.append('scope', 'GIGACHAT_API_PERS');

    const tokenRes = await fetch('https://ngw.devices.sberbank.ru:9443/api/v2/oauth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'RqUID': crypto.randomUUID(),
        'Authorization': `Basic ${authString}`
      },
      body: authParams,
      cache: 'no-store'
    });

    if (!tokenRes.ok) {
      console.error("Token error:", await tokenRes.text());
      throw new Error(`Auth failed: ${tokenRes.status}`);
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    // 2. Отправка сообщения
    const chatRes = await fetch('https://gigachat.devices.sberbank.ru/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        model: 'GigaChat',
        messages: payload,
        temperature: 0.7,
      }),
      cache: 'no-store'
    });

    if (!chatRes.ok) {
      console.error("Chat error:", await chatRes.text());
      throw new Error(`Chat API failed: ${chatRes.status}`);
    }

    const chatData = await chatRes.json();
    return chatData.choices[0].message.content;
  } catch (error) {
    console.error("GigaChat Integration Error:", error);
    return "Ох, что-то я запамятовал... Можете повторить, пожалуйста?";
  }
}
