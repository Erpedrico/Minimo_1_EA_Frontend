import { Experiencia } from "./experiencia.model";
import { User } from "./user.model";
import { Vinos } from "./vinos.model";

export interface valoracionesInterface {
    _id?: string;
    owner: User;
    experiencia: Experiencia;
    vino: Vinos[];
    likes: number;
    dislikes: number;
    comments: string[];
}