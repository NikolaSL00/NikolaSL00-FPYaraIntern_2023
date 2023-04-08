import { Body, Controller, Post } from '@nestjs/common';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { CreateMovementDTO } from './dtos/create-movement.dto';
import { MovementDTO } from './dtos/movement.dto';
import { MovementsService } from './movements.service';

@Controller('movements')
@Serialize(MovementDTO)
export class MovementsController {
  constructor(private movementService: MovementsService) {}

  @Post()
  createMovement(@Body() body: CreateMovementDTO) {
    return this.movementService.addMovement(body);
  }
}
