import { AbstractEntity } from '@app/common';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Profile } from '../../profiles/entities/profile.entity';
import { Role } from '../../roles/entities/role.entity';

@Entity({
    name: 'users'
})
export class User extends AbstractEntity<User> {
    @Column()
    email: string;

    @Column()
    password: string;

    @OneToOne(() => Profile, (profile) => profile.user, {
        cascade: true,
        eager: true,
        onDelete: 'CASCADE'
    })
    @JoinColumn()
    profile: Profile;

    @ManyToOne(() => Role, (role) => role.users, {
        eager: true,
        cascade: true
    })
    @JoinColumn()
    role: Role;
}
