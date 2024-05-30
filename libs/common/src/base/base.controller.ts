import { Controller, Req } from '@nestjs/common';
import { Request } from 'express';

@Controller()
export class BaseController {
  protected getUrl(@Req() req: Request): string {
    return `${req.protocol}://${req.get('host')}${req.originalUrl.split('?')[0]}`;
  }
}