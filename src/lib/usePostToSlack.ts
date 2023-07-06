export const usePostToSlack = (webhookUrl: string) => {
  const postToSlack = async (content: string) => {
    const payload = { text: content };

    await fetch(webhookUrl, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  };

  return { postToSlack };
};
