import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import { ToDoItems } from "../ToDoItems";
import {User} from "../User";
import {Field, ObjectType} from "type-graphql";


@ObjectType()
@Entity()
export class ToDo extends BaseEntity  {
    constructor(user: User, name: String) {
        super();
        this.name = name;
        this.user = user;
    }

    @PrimaryGeneratedColumn()
    @Field()
    public id: number;

    @Column()
    @Field()
    public name: String = '';

    @OneToMany(type => ToDoItems, todoItems => todoItems.todo, { eager: true })
    @Field(() => [ToDoItems])
    items: ToDoItems[]

    @ManyToOne(type => User, user => user.todo, { eager: true, onDelete: "CASCADE" })
    @Field(() => User)
    user: User

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public created_at: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    public updated_at: Date;
}

export default ToDo;