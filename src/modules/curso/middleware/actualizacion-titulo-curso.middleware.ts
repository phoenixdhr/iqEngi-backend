import { CursoComprado } from 'src/modules/curso-comprado/entities/curso-comprado.entity';
import { Curso, CursoSchema } from '../entities/curso.entity';
import { Model } from 'mongoose';

/**
 * Middleware post-save para actualizar los títulos de los cursos en las inscripciones relacionadas
 */
CursoSchema.post<Curso>('save', async function (doc, next) {
  try {
    const CursoCompradoModel = this.model(
      `${CursoComprado.name}`,
    ) as Model<CursoComprado>; // Asegúrate de tener el modelo de Enrollment
    await CursoCompradoModel.updateMany(
      { courseId: doc._id },
      { $set: { courseTitle: doc.titulo } },
    );
    next();
  } catch (error) {
    next(error);
  }
});

// course.schema.ts (continuación)
CursoSchema.post<Curso>('findOneAndUpdate', async function (doc: Curso, next) {
  try {
    if (doc) {
      const EnrollmentModel = this.model(
        `${CursoComprado.name}`,
      ) as Model<CursoComprado>;
      await EnrollmentModel.updateMany(
        { courseId: doc._id },
        { courseTitle: doc.titulo },
      );
    }
  } catch (error) {
    next(error);
  }
});
