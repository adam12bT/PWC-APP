import { Post } from "./post";
 
export class User {
    id!: number ;
    firstname!: string;
    lastname!:string;
    email!: string;
    image!: string; // Assuming you handle image as a string URL or base64 data in Angular
    tel!:number;
    informations!:string;
    isActive:boolean=true;
    password!:string
    posts!: Post[];
}
 
 