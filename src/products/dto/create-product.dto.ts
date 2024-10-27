import * as yup from 'yup';

export class CreateProductDto {
    id?: string;
    title: string;
    image: string;
    description?: string;
    price: number;
}
export const ProductValidation: yup.Schema<CreateProductDto> = yup.object().shape({
    title: yup.string().required("O titulo é obrigatório."),
    image: yup.string().url("O endereço da imagem não é válido").required("A Imagem é obrigatória."),
    price: yup.number().required("O preço é obrigatório."),
}) as yup.Schema<CreateProductDto>;