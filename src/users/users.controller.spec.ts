import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UpdateUserDto } from './dtos/update-user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let mockedUsersService: Partial<UsersService>;
  let mockedAuthService: Partial<AuthService>;

  beforeEach(async () => {
    let users: User[] = [];

    mockedUsersService = {
      findOne: (id: number) => {
        return Promise.resolve({
          id,
          email: 'test@email.com',
          password: 'password',
        } as User);
      },
      find: (email: string) => {
        return Promise.resolve([
          {
            id: 1,
            email,
            password: 'password',
          } as User,
        ]);
      },
      remove: (id: number) => {
        users = users.filter((user) => user.id !== id);
        return Promise.resolve();
      },
      update: (id: number, attrs: Partial<User>) => {
        users = users.map((user) => {
          if (user.id === id) {
            return {
              ...user,
              ...attrs,
            } as User;
          }

          return user;
        });

        return Promise.resolve();
      },
    };
    mockedAuthService = {
      // signup: () => {},
      // signin: () => {},
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockedUsersService,
        },
        {
          provide: AuthService,
          useValue: mockedAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return user by id', async () => {
    const user = await controller.findUser('1');

    expect(user).toEqual({
      id: 1,
      email: 'test@email.com',
      password: 'password',
    });
  });

  it('should return all users', async () => {
    const users = await controller.findAllUsers('test@email.com');

    expect(users).toEqual([
      {
        id: 1,
        email: 'test@email.com',
        password: 'password',
      },
    ]);
  });
});
