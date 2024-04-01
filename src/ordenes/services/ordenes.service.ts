import { Injectable, NotFoundException } from '@nestjs/common';
import { EstadoOrden, Orden } from '../entities/orden.entity'; // Asegúrate de ajustar la ruta de importación

@Injectable()
export class OrdenesService {
  // Simulación de datos: Array de órdenes basado en el array de cursos
  private ordenes: Orden[] = [
    {
      _id: 'o101', // Simulando un ID de orden
      usuarioId: 'u001', // ID de usuario simulado
      cursos: ['101'], // IDs de cursos en un array
      fechaCompra: new Date('2023-06-20'), // Fecha de compra simulada
      montoTotal: 405, // Precio después de aplicar el descuento
      estado: EstadoOrden.Completada, // Simulando un estado de la orden
    },
    {
      _id: 'o102',
      usuarioId: 'u002',
      cursos: ['102'], // Asegúrate de que los IDs de los cursos sean un array, incluso si es solo un curso
      fechaCompra: new Date('2023-07-05'),
      montoTotal: 450, // Precio después de aplicar el descuento
      estado: EstadoOrden.Pendiente,
    },
    {
      _id: 'o103',
      usuarioId: 'u003',
      cursos: ['103'], // Asegúrate de que los IDs de los cursos sean un array
      fechaCompra: new Date('2023-08-15'),
      montoTotal: 360, // Precio después de aplicar el descuento
      estado: EstadoOrden.Procesando,
    },
  ];

  // Encuentra todas las órdenes
  findAll() {
    return this.ordenes;
  }

  // Encuentra una orden por su ID
  findOne(id: string): Orden {
    const orden = this.ordenes.find((orden) => orden._id === id);
    if (!orden) {
      throw new NotFoundException(`Orden con ID ${id} no encontrada`);
    }
    return orden;
  }

  // Crea una nueva orden
  create(payload: any): Orden {
    // Genera un nuevo ID basado en el máximo actual y lo convierte a string
    const newId = (
      Math.max(...this.ordenes.map((o) => parseInt(o._id.substr(1)))) + 1
    ).toString();
    const newOrden: Orden = {
      _id: `o${newId}`, // Asegura un formato de ID único precedido por 'o'
      ...payload,
      fechaCompra: new Date(), // Puede requerir fecha de payload o generarla automáticamente
      estado: EstadoOrden.Pendiente, // Estado inicial para nuevas órdenes
    };
    this.ordenes.push(newOrden);
    return newOrden;
  }

  // Actualiza una orden existente por su ID
  update(id: string, payload: any): Orden {
    const index = this.ordenes.findIndex((orden) => orden._id === id);
    if (index === -1) {
      throw new NotFoundException(
        `Orden con ID ${id} no encontrada para actualizar`,
      );
    }
    // Actualización parcial: sólo cambia los campos proporcionados en payload
    this.ordenes[index] = { ...this.ordenes[index], ...payload };
    return this.ordenes[index];
  }

  // Elimina una orden por su ID
  delete(id: string): Orden {
    const index = this.ordenes.findIndex((orden) => orden._id === id);
    if (index === -1) {
      throw new NotFoundException(
        `Orden con ID ${id} no encontrada para eliminar`,
      );
    }
    const orden = this.ordenes[index];
    this.ordenes = this.ordenes.filter((orden) => orden._id !== id);
    return orden;
  }
}
