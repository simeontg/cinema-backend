import { AbstractEntity } from '@app/common';
import { Column, Entity, OneToMany, } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Roles } from '../types/roles.enum';

@Entity({
    name: 'roles'
})
export class Role extends AbstractEntity<Role> {
    @Column({
        type: 'enum',
        enum: Roles
    })
    name: Roles;

    @OneToMany(() => User, (user) => user.role)
    users: User[];
}