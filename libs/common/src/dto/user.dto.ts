export interface UserDto {
    id: string;
    email: string;
    profile: {
        id: string;
        firstName: string;
    }
}