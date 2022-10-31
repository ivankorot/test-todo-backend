import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import { ToDo } from "../ToDo";
import {Field, ObjectType} from "type-graphql";

@ObjectType()
@Entity()

export class ToDoItems extends BaseEntity {
    constructor(text: String, toDo: ToDo) {
        super();
        this.text = text;
        this.todo = toDo
    }

    @PrimaryGeneratedColumn()
    @Field()
    id: number

    @Column({ type: "varchar" })
    @Field()
    text: String = '';

    @Column({type: "boolean", default: false})
    @Field()
    public isComplete: boolean = false;

    @ManyToOne(type => ToDo, todo => todo.items, { eager: false, onDelete: "CASCADE" })
    @Field(() => ToDo)
    todo: ToDo

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public created_at: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    public updated_at: Date;
}