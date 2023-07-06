import { ForwardableEmailMessage } from '@cloudflare/workers-types';

export default {
  async email(email: ForwardableEmailMessage): Promise<void> {
    console.log(`received email from ${email.from} to ${email.to}`);
  },
};
