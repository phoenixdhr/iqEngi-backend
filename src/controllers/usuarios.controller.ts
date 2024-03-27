import { Controller } from '@nestjs/common';

@Controller('usuarios')
export class UsuariosController {

    // @Post()
    // createUser(@Body() createUserDto: CreateUserDto) {
    //   return this.usuarioService.create(createUserDto);
    // }

    // @Get()
    // getAllUsers() {
    //   return this.usuarioService.findAll();
    // }

    // @Get(':id')
    // getUserById(@Param('id') id: string) {
    //   return this.usuarioService.findOneById(id);
    // }

    // @Put(':id')
    // updateUser(@Param('id') id: string, @Body() createUserDto: CreateUserDto) {
    //   // Asume que updateUser en el servicio maneja una actualización completa
    //   return this.usuarioService.update(id, createUserDto);
    // }

    // @Patch(':id')
    // patchUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    //   // Asume que patchUser en el servicio maneja una actualización parcial
    //   return this.usuarioService.patch(id, updateUserDto);
    // }

    // @Delete(':id')
    // deleteUser(@Param('id') id: string) {
    //   return this.usuarioService.delete(id);
    // }

}
