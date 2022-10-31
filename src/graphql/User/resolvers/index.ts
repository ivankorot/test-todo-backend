import {Resolver, Query, Mutation, Arg, UseMiddleware, Ctx} from 'type-graphql';
import {User} from '../../../entities/User';
import {UserService} from "../../../services/User/user.service";
import {ApolloError} from "apollo-server-express";
import {isAuth, MyContext} from "../../../middlewares/isAuth";
import {Inject} from "typedi";

@Resolver(of => User)
class UserResolver {
    private userService: UserService;

    constructor(@Inject(() => UserService) userService: UserService) {
        this.userService = userService;
    }

    @Query(returns => User, { name: 'user', nullable: true })
    @UseMiddleware(isAuth)
    async getUser(@Ctx() { payload }: MyContext): Promise<User> {
        return await this.userService.getUserById(payload.id)
    }

    @Mutation(returns => String, { name: 'register', nullable: true })
    async register(@Arg('username') name: string, @Arg('password') password: string): Promise<String> {
        const user = await this.userService.register(name, password);
        if (user != null) {
            return this.userService.createToken({ id: user.id });
        }
        throw new ApolloError('Internal Server Error', '500');
    }

    @Mutation(returns => String, { name: 'login', nullable: true })
    async login(@Arg('username') username: string, @Arg('password') password: string): Promise<String> {
        const user = await this.userService.login(username, password);
        if (user != null) {
            return this.userService.createToken({ id: user.id });
        }
        throw new ApolloError('Unauthorized', '401');
    }
}

export default UserResolver;