import {Resolver, Query, Mutation, Arg, UseMiddleware, Ctx} from 'type-graphql';
import {ToDo} from '../../../entities/ToDo';
import {isAuth, MyContext} from "../../../middlewares/isAuth";
import {ToDoService} from "../../../services/ToDo/todo.service";
import {ToDoItems} from "../../../entities/ToDoItems";
import {Inject} from "typedi";

@Resolver(of => ToDo)
class ToDoResolver {
    private todoService: ToDoService;

    constructor(@Inject(() => ToDoService) todoService: ToDoService) {
        this.todoService = todoService;
    }

    @Query(returns => [ToDo], { name: 'listToDos', nullable: true })
    @UseMiddleware(isAuth)
    async listToDos(@Ctx() { payload }: MyContext, ): Promise<ToDo[]> {
        return await this.todoService.getToDos(payload.id)
    }

    @Query(returns => [ToDoItems], { name: 'getToDoItems', nullable: true })
    @UseMiddleware(isAuth)
    async listToDoItems(@Ctx() { payload }: MyContext,
                        @Arg("filter", {defaultValue: "all"}) filter: String = "all" ,
                        @Arg("id") id: number): Promise<ToDoItems[]> {
        return await this.todoService.getToDoItems(payload.id, filter, id)
    }

    @Mutation(returns => ToDo, { name: 'createToDo', nullable: true })
    @UseMiddleware(isAuth)
    async createToDo(@Ctx() { payload }: MyContext, @Arg('text') name: string): Promise<ToDo> {
        return await this.todoService.createToDo(payload.id, name);
    }

    @Mutation(returns => ToDoItems, { name: 'createToDoItem', nullable: true })
    @UseMiddleware(isAuth)
    async createToDoItem(@Ctx() { payload }: MyContext, @Arg('id') id: number,
                         @Arg('title') text: string): Promise<ToDoItems> {
        return await this.todoService.createToDoItem(payload.id, id, text);
    }

    @Mutation(returns => Boolean, { name: 'markToDoCompleted', nullable: true })
    @UseMiddleware(isAuth)
    async markTodoCompleted(@Ctx() { payload }: MyContext, @Arg('id') id: number,
                            @Arg('isCompleted') isCompleted: boolean): Promise<Boolean> {
        return await this.todoService.updateToDoItem(payload.id, id, isCompleted);
    }

    @Mutation(returns => Boolean, { name: 'deleteToDo', nullable: true })
    @UseMiddleware(isAuth)
    async deleteToDo(@Ctx() { payload }: MyContext, @Arg('id') id: number): Promise<Boolean> {
        return await this.todoService.deleteToDo(payload.id, id);
    }

    @Mutation(returns => Boolean, { name: 'deleteToDoItem', nullable: true })
    @UseMiddleware(isAuth)
    async deleteToDoItem(@Ctx() { payload }: MyContext, @Arg('id') id: number): Promise<Boolean> {
        return await this.todoService.deleteToDoItem(payload.id, id);
    }
}

export default ToDoResolver;