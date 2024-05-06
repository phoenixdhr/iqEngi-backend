import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { Curso } from '../../cursos/entities/curso.entity';
import { CuestionarioRespuestaUsuario } from '../../cuestionario-respuesta-usuario/entities/cuestionario-respuesta-usuario.entity';
import { Entidades } from '../../_common/nameEntidaes';

// #region ProgresoCurso
@Schema()
export class ProgresoCurso extends Document {
  @Prop({ type: Types.ObjectId, ref: Curso.name, required: true })
  cursoId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Entidades.Usuario, required: true })
  usuarioId: Types.ObjectId;

  @Prop({
    type: [Types.ObjectId],
    ref: CuestionarioRespuestaUsuario.name,
    default: [],
  })
  evaluacionUsuarioCuestionarios: Types.Array<Types.ObjectId>;

  @Prop({ required: true, default: 0 })
  progresoTotal: number; // SE CALCULA EN BASE A LAS UNIDADES QUE EL USUARIO HA COMPLETADO
}

export const ProgresoCursoSchema = SchemaFactory.createForClass(ProgresoCurso);
