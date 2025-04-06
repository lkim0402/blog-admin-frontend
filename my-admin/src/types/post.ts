export interface Post {
  _id: string;
  title: string;
  content: string;
  body: string;
  category: string;
  date: string;
  cover_image?: string;
  updated_date?: string;
  tags?: string[];
}
