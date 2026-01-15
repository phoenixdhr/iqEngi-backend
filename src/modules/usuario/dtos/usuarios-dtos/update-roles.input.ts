import { InputType, Field } from '@nestjs/graphql';
import { ArrayNotEmpty, IsArray, IsEnum } from 'class-validator';
import { RolEnum } from 'src/common/enums/rol.enum';

/**
 * DTO para actualizar los roles de un usuario.
 * Solo puede ser utilizado por administradores.
 */
@InputType()
export class UpdateRolesInput {
    @Field(() => [RolEnum], {
        description: 'Array de roles a asignar al usuario',
    })
    @IsArray()
    @ArrayNotEmpty({ message: 'Debe proporcionar al menos un rol' })
    @IsEnum(RolEnum, { each: true, message: 'Cada rol debe ser válido' })
    roles: RolEnum[];
}
