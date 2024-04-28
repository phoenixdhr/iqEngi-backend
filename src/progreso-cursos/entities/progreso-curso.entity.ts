import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { Curso } from '../../cursos/entities/curso.entity';
// import { Id } from '../../_common/dtos/id';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { CuestionarioRespuestaUsuario } from '../../cuestionario-respuesta-usuario/entities/cuestionario-respuesta-usuario.entity';

//ENTIDAD
@Schema()
export class ProgresoCurso extends Document {
  @Prop({ type: Types.ObjectId, ref: Curso.name })
  cursoId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Usuario.name })
  usuarioId: Types.ObjectId;

  @Prop({
    type: [Types.ObjectId],
    ref: CuestionarioRespuestaUsuario.name,
    default: [],
  })
  evaluacionUsuarioCuestionarios?: Types.ObjectId[];

  @Prop({ required: true, default: 0 })
  progresoTotal: number;
}

export const ProgresoCursoSchema = SchemaFactory.createForClass(ProgresoCurso);
