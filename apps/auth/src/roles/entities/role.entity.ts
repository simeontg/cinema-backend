import { AbstractEntity } from '@app/common';
import { Column, Entity, OneToMany, } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity({
    name: 'roles'
})
export class Role extends AbstractEntity<Role> {
    @Column()
    name: string;

    @OneToMany(() => User, (user) => user.role)
    users: User[];
}
