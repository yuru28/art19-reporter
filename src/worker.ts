import { ForwardableEmailMessage } from '@cloudflare/workers-types';

import { useStreamToArrayBuffer } from './lib/useStreamToArrayBuffer';
import { useParseRawEmail } from './lib/useParseRawEmail';
import { usePostToSlack } from './lib/usePostToSlack';
import { Env } from './interfaces';

const extractDlCount = (text: string) => {
  const match = text.match(/(?<=Series Listens Yesterday\n)(\d+)/);

  return match ? Number(match[0]) : -1;
};

const { streamToArrayBuffer } = useStreamToArrayBuffer();
const { parseEmail } = useParseRawEmail();

export default {
  async email(email: ForwardableEmailMessage, env: Env): Promise<void> {
    const { postToSlack } = usePostToSlack(env.YURU28_SLACK_WEBHOOK_URL);

    const rawEmail = await streamToArrayBuffer(email.raw, email.rawSize);
    const parsedEmail = await parseEmail(rawEmail);

    const dlCount = parsedEmail.text ? extractDlCount(parsedEmail.text) : -1;

    const content = `昨日のDL数: ${dlCount}`;

    await postToSlack(content);
  },
};
