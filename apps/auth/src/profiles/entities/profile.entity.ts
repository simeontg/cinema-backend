import { AbstractEntity } from '@app/common';
import { Column, Entity, OneToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity({
    name: 'profiles'
})
export class Profile extends AbstractEntity<Profile> {
    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({
        nullable: true
    })
    phoneNumber: string;

    @OneToOne(() => User, (user) => user.profile)
    user: User;
}
