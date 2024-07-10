import { User } from "./user";
 import { Comment } from "./comment";
export class Post {
    id!: number;
  content!: string;
  image!: string; // Assuming you handle image as a string URL or base64 data in Angular
  user!: User;
  comments!: Comment[];}