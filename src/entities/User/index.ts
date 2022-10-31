import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    Unique, UpdateDateColumn
} from "typeorm";
import ToDo from "../ToDo";
import {Field, Int, ObjectType} from "type-graphql";

@ObjectType()
@Entity()
@Unique(['username'])

export class User extends BaseEntity {
    constructor(username: string, password: string) {
        super();
        this.username = username;
        this.password = password;
    }

    @PrimaryGeneratedColumn()
    @Field(type => Int)
    id: number

    @Column({ type: "varchar" })
    @Field()
    username: string

    @Column({ type: "varchar" })
    password: string

    @OneToMany(type => ToDo, todo => todo.user, { eager: false })
    @Field(type => [ToDo])
    todo: ToDo[]

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    @Field()
    public created_at: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    @Field()
    public updated_at: Date;
}