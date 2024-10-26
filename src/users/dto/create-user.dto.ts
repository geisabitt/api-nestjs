import * as yup from 'yup';

export enum UserTypes {
    ADMIN = 'admin',
    SELLER = 'seller',
    CLIENT = 'client',
}
export class CreateUserDto {
    id?: string;
    name: string;
    email: string;
    password: string;
    type: UserTypes;
}

export const UserValidation: yup.Schema<CreateUserDto> = yup.object().shape({
    name: yup.string().required("O nome é obrigatório.") as yup.Schema<string>,  
    email: yup.string().email("O email deve ser um endereço de email válido.").required("O email é obrigatório.") as yup.Schema<string>,  
    password: yup.string()
        .required("A senha é obrigatória.")
        .min(8, "A senha deve ter pelo menos 8 caracteres.")
        .matches(/[a-zA-Z]/, "A senha deve conter pelo menos uma letra.")
        .matches(/\d/, "A senha deve conter pelo menos um número.") as yup.Schema<string>,  
    type: yup.mixed<UserTypes>()
        .oneOf(Object.values(UserTypes) as UserTypes[], "Tipo de usuário inválido.")
        .required("O tipo de usuário é obrigatório.") as yup.Schema<UserTypes>,  
}) as yup.Schema<CreateUserDto>;