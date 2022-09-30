/*CreateUserDto, UpdateUserDto, ListAllEntities */

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
}

export interface UpdateUserDto {
  name: string;
  email: string;
  password: string;
}

export interface ListAllEntities {
  limit: number;
}
