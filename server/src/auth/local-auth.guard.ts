import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  // Метод canActivate выполняет проверку доступа
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    // Вы можете добавить дополнительную логику перед вызовом базового canActivate
    console.log('LocalAuthGuard is being executed');
    return super.canActivate(context) as boolean;
  }
}
