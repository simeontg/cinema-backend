import { AbstractEntity } from '@app/common';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Profile } from '../../profiles/entities/profile.entity';
import { Role } from '../../roles/entities/role.entity';
import { AuthType } from '../types/auth-type.enum';

@Entity({
    name: 'users'
})
export class User extends AbstractEntity<User> {
    @Column()
    email: string;

    @Column({
        nullable: true
    })
    password: string;

    @OneToOne(() => Profile, (profile) => profile.user, {
        cascade: true,
        eager: true,
        onDelete: 'CASCADE'
    })
    @JoinColumn()
    profile: Profile;

    @Column({
        type: 'enum',
        enum: AuthType,
        default: AuthType.Google
    })
    authType: AuthType;

    @ManyToOne(() => Role, (role) => role.users, {
        eager: true,
        cascade: true
    })
    @JoinColumn()
    role: Role;
}
