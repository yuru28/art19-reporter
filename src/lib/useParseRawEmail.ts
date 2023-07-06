import PostalMime from 'postal-mime';

const parseEmail = async (rawEmail: Uint8Array) => {
  const parser = new PostalMime();

  return parser.parse(rawEmail);
};

export const useParseRawEmail = () => {
  return { parseEmail };
};
