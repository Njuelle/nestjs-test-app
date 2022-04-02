import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let service: AuthService;
  let mockedUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];
    mockedUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockedUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('create a new user with a salted and hashed password', async () => {
    const user = await service.signup('aze@email.com', 'password');
    expect(user.password).not.toEqual('password');

    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with an email that already exists', async () => {
    await service.signup('test@email.com', 'password');

    await expect(service.signup('test@email.com', 'password')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('throws an error if user signs in with an email that not exists', async () => {
    await expect(
      service.signin('notknown@email.com', 'password'),
    ).rejects.toThrow(NotFoundException);
  });

  it('throws an error if user signs in with an invalid password', async () => {
    await service.signup('test@email.com', 'password');

    await expect(
      service.signin('test@email.com', 'wrongpassword'),
    ).rejects.toThrow(BadRequestException);
  });

  it('returns the user if user signs in with a valid password', async () => {
    await service.signup('test@email.com', 'password');

    const user = await service.signin('test@email.com', 'password');
    expect(user).toBeDefined();
  });
});
