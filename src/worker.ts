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
    const allowedSenders = env.ALLOWED_SENDERS.split(',');

    const { postToSlack } = usePostToSlack(env.YURU28_SLACK_WEBHOOK_URL);

    const rawEmail = await streamToArrayBuffer(email.raw, email.rawSize);
    const parsedEmail = await parseEmail(rawEmail);

    if (!allowedSenders.includes(email.from)) {
      const message = `art19-reporter: Invalid sender from: ${email.from}`;

      email.setReject(message);
      await postToSlack(message);

      return;
    }

    const subject = parsedEmail.subject || '';
    if (!subject.includes('Daily Report for ゆるふわPodcast')) {
      const message = `art19-reporter: Invalid subject: ${subject}`;

      email.setReject(message);
      await postToSlack(message);

      return;
    }

    const dlCount = parsedEmail.text ? extractDlCount(parsedEmail.text) : -1;

    const content = `昨日のDL数: ${dlCount}` + '\n' + env.ART19_ADMIN_STATISTICS_URL;

    await postToSlack(content);
  },
};
