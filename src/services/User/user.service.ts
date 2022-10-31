import { User } from '../../entities/User';
import * as jwt from 'jsonwebtoken';
import {Repository} from 'typeorm';
import * as bcrypt from 'bcrypt';
import config from "../../config";
import {ApolloError} from "apollo-server-express";
import {Service} from "typedi";
import {InjectRepository} from "typeorm-typedi-extensions"
const { secrets } = config;

interface JwtPayload {
    id: number;
}

@Service()
export class UserService {
    private userRepository: Repository<User>;

    constructor(@InjectRepository(User) repository: Repository<User>) {
        this.userRepository = repository;
    }

    createToken(payload: JwtPayload): any {
        const secretOrKey = secrets.JWT;
        const token = jwt.sign(payload, secretOrKey);
        return token;
    }

    async getUserById(id: number): Promise<User> {
        const user = this.userRepository.findOne({where: {id}})
        if (!user) {
            throw new ApolloError('Unauthorized', '403');
        }
        return await this.userRepository.findOne(id);
    }

    async register(username: string, password: string): Promise<User> {
        const duplicate = await this.userRepository.findOne({ where: { username } });
        if (duplicate != null) {
            throw new ApolloError(
                'username already taken',
                '403',
            );
        }
        if (password == undefined)
            password = "";

        password = await bcrypt.hash(password, 10);
        return await this.userRepository.save(new User(username, password));
    }

    async login(username: string, password: string): Promise<User> {
        if (password == "") {
            throw new ApolloError('empty password', '400');
        }
        const user = await this.userRepository.findOne({ where: { username } });
        if (user == null) return user;
        const isValid = await bcrypt.compare(password, user.password)
        if (isValid) {
            return user;
        }
        return null;
    }
}