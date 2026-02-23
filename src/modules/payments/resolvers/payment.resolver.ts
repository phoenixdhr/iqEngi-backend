import { UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Types } from 'mongoose';

import { JwtGqlAuthGuard } from 'src/modules/auth/jwt-auth/jwt-auth.guard/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/roles-guards/roles.guard';
import { RolesDec } from 'src/modules/auth/decorators/roles.decorator';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { UserRequest } from 'src/modules/auth/entities/user-request.entity';
import { allRoles } from 'src/common/enums/rol.enum';
import { IdPipe } from 'src/common/pipes/mongo-id/mongo-id.pipe';
import { PaginationArgs } from 'src/common/dtos';

import { Payment } from '../entities/payment.entity';
import { PaymentService } from '../services/payment.service';
import { IniciarPagoInput } from '../dtos/iniciar-pago.input';

@Resolver(() => Payment)
@UseGuards(JwtGqlAuthGuard, RolesGuard)
export class PaymentResolver {
  constructor(private readonly paymentService: PaymentService) { }

  @Mutation(() => Payment, { name: 'Payment_iniciarPago' })
  @RolesDec(...allRoles)
  async iniciarPago(
    @Args('input') input: IniciarPagoInput,
    @CurrentUser() user: UserRequest,
  ): Promise<Payment> {
    const userId = new Types.ObjectId(user._id);
    return this.paymentService.iniciarPago(input, userId, user.email);
  }

  @Query(() => Payment, { name: 'Payment_obtenerPorId' })
  @RolesDec(...allRoles)
  async obtenerPorId(
    @Args('paymentId', { type: () => ID }, IdPipe) paymentId: Types.ObjectId,
  ): Promise<Payment> {
    return this.paymentService.obtenerPorId(paymentId);
  }

  @Query(() => [Payment], { name: 'Payment_miHistorial' })
  @RolesDec(...allRoles)
  async miHistorial(
    @CurrentUser() user: UserRequest,
    @Args({ type: () => PaginationArgs, nullable: true })
    pagination?: PaginationArgs,
  ): Promise<Payment[]> {
    const userId = new Types.ObjectId(user._id);
    return this.paymentService.obtenerHistorial(
      userId,
      pagination?.limit,
      pagination?.offset,
    );
  }
}
