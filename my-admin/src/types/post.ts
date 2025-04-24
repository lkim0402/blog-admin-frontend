export interface Post {
  _id: string;
  title: string;
  content: string;
  body: string;
  category: string;
  date: string;
  cover_image?: string;
  updated_date?: string;
  tags?: Tag[];
  status: string;
}

export const categories = ["All", "Workshop", "Journal"];

export type Tag = {
  _id: string;
  tag: string;
};
