import {User} from "./User";
import Todo from "./ToDo";
import {ToDoItems} from "./ToDoItems";


const entities = {
    User,
    Todo,
    ToDoItems
};

export const dbEntities = Object.values(entities);
export default entities;