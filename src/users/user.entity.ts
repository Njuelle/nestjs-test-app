import {
  AfterInsert,
  AfterUpdate,
  AfterRemove,
  Entity,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @AfterInsert()
  logInsert() {
    console.log('User inserted with ID : ', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('User updated with ID : ', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('User removed with ID: ', this.id);
  }
}
