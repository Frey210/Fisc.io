const TELEGRAM_API_BASE = 'https://api.telegram.org/bot';

export async function sendTelegramMessage(
  chatId: number | string,
  text: string,
  parseMode: 'HTML' | 'MarkdownV2' = 'HTML'
) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    throw new Error('TELEGRAM_BOT_TOKEN is not defined in environment variables');
  }

  const response = await fetch(`${TELEGRAM_API_BASE}${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: parseMode,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Failed to send telegram message: ${errorBody}`);
  }

  return response.json();
}

export async function getTelegramFileUrl(fileId: string): Promise<string> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    throw new Error('TELEGRAM_BOT_TOKEN is not defined in environment variables');
  }

  const response = await fetch(`${TELEGRAM_API_BASE}${token}/getFile?file_id=${fileId}`);
  if (!response.ok) {
    throw new Error(`Failed to get Telegram file: ${await response.text()}`);
  }

  const data = await response.json();
  const filePath = data.result?.file_path;
  if (!filePath) {
    throw new Error('No file_path returned by Telegram API');
  }

  return `https://api.telegram.org/file/bot${token}/${filePath}`;
}
