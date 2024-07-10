// comment.model.ts
export interface Comment {
  content: string;
  post: { id: number };
  user: { id: number };
}
