import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { CreateMovementDTO } from './dtos/create-movement.dto';
import { GetMovementsDTO } from './dtos/get-movements.dto';
import { MovementDTO } from './dtos/movement.dto';
import { MovementsService } from './movements.service';

@UseGuards(AuthGuard)
@Controller('movements')
export class MovementsController {
  constructor(private movementService: MovementsService) {}

  @Post()
  @Serialize(MovementDTO)
  createMovement(@CurrentUser() user: User, @Body() body: CreateMovementDTO) {
    return this.movementService.addMovement(body, user);
  }

  @Get()
  @Serialize(GetMovementsDTO)
  getMovementsForWarehouse(
    @Query('warehouseId')
    warehouseId: string,
  ) {
    return this.movementService.getMovementsForWarehouse(parseInt(warehouseId));
  }
}
