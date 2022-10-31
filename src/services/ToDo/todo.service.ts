import {Repository} from 'typeorm';
import {Service} from "typedi";
import {InjectRepository} from "typeorm-typedi-extensions"
import ToDo from "../../entities/ToDo";
import {ToDoItems} from "../../entities/ToDoItems";
import {ApolloError} from "apollo-server-express";
import {User} from "../../entities/User";

@Service()
export class ToDoService {
    private todoRepository: Repository<ToDo>;
    private todoItemsRepository: Repository<ToDoItems>
    private userRepository: Repository<User>

    constructor(@InjectRepository(ToDo) toDoRepository: Repository<ToDo>,
                @InjectRepository(ToDoItems) toDoItemsRepository: Repository<ToDoItems>,
                @InjectRepository(User) userRepository: Repository<User>) {
        this.todoRepository = toDoRepository;
        this.todoItemsRepository = toDoItemsRepository;
        this.userRepository = userRepository
    }

    async createToDo(userID: number, name: String): Promise<ToDo> {
        const duplicate = await this.todoRepository.findOne({ where: { name } });
        if (duplicate != null) {
            throw new ApolloError(
                'This name already exist!',
                '500',
            );
        }
        if (name === undefined || name === "")
            throw new ApolloError(`ToDo name can't be empty`, '500');

        const user = await this.userRepository.findOne(userID)

        if (!user) {
            throw new ApolloError(`Unauthorized!`, '403');
        }

        const todo = {
            name,
            user
        }
        return await this.todoRepository.save(todo);
    }

    async createToDoItem(userID: number, todoID: Number, text: String): Promise<ToDoItems> {
        const todo = await this.todoRepository.findOne({where: {id: todoID, user: userID}})
        if (todo == null) {
            throw new ApolloError(
                `Cant find todo!`,
                '500',
            );
        }

        if (!todo) {
            throw new ApolloError(`Unauthorized!`, '403');
        }

        const duplicate = await this.todoItemsRepository.findOne({ where: { text, todo: todoID } });
        if (duplicate != null) {
            throw new ApolloError(
                'This name already exist!',
                '500',
            );
        }
        if (text === undefined || text === "")
            throw new ApolloError(`ToDo Item can't be empty`, '500');

        const item = {text, todo}
        const todoItem = this.todoItemsRepository.save(item)

        return todoItem;
    }

    async updateToDoItem(userID: number, itemID: number, isComplete: boolean): Promise<Boolean> {
        const todoItem = await this.todoItemsRepository.findOne({ where: { id: itemID } });
        if (todoItem == null) {
            throw new ApolloError(
                `Can't find todo!`,
                '500',
            );
        }

        const user = await this.userRepository.findOne(userID)

        if (!user) {
            throw new ApolloError(`Unauthorized!`, '403');
        }

        const updatedResult = await this.todoItemsRepository.update({id: todoItem.id}, {isComplete})
        console.log(updatedResult)
        return updatedResult.affected > 0
    }

    async getToDos(userID: number): Promise<ToDo[]> {
        const test = await this.todoRepository.find({where: {user: userID}})
        return test
    }

    async getToDoItems(userID: number, filter: String, todoID: number): Promise<ToDoItems[]> {
        const todo = await this.todoRepository.findOne({
            where: {
                user: userID,
                id: todoID
            },
        })
        if (!todo) {
            throw new ApolloError(`Internal Server Error!`, '500');
        }

        const filteredItems = todo.items.filter(todo => {
            switch (filter) {
                case "completed":
                    return todo.isComplete
                case "incompleted":
                    return !todo.isComplete
                case "all":
                    return true
            }
        })

        return filteredItems
    }

    async deleteToDo(userID: number, todoID: number): Promise<Boolean> {
        const todo = await this.todoRepository.find({where: {user: userID}})

        if (!todo) {
            throw new ApolloError(`Unauthorized!`, '403');
        }

        const deleteResult = await this.todoRepository.delete(todoID)
        return deleteResult.affected > 0;
    }

    async deleteToDoItem(userID: number, itemID: number): Promise<Boolean> {
        const user = await this.userRepository.findOne(userID)

        if (!user) {
            throw new ApolloError(`Unauthorized!`, '403');
        }

        const deleteResult = await this.todoItemsRepository.delete(itemID)
        return deleteResult.affected > 0
    }
}