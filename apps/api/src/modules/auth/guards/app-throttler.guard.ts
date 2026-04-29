import { ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ThrottlerGuard } from '@nestjs/throttler'

import { THROTTLE_TIER_KEY } from '@/modules/auth/decorators/throttle-tier.decorator'

@Injectable()
export class AppThrottlerGuard extends ThrottlerGuard {
  constructor(
    options: ConstructorParameters<typeof ThrottlerGuard>[0],
    storageService: ConstructorParameters<typeof ThrottlerGuard>[1],
    reflector: Reflector,
  ) {
    super(options, storageService, reflector)
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const tier =
      this.reflector.getAllAndOverride<string>(THROTTLE_TIER_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) ?? 'global'

    context.switchToHttp().getRequest().__throttleTier = tier

    return super.canActivate(context)
  }

  protected async handleRequest(
    requestProps: Parameters<ThrottlerGuard['handleRequest']>[0],
  ): Promise<boolean> {
    const tier =
      requestProps.context.switchToHttp().getRequest().__throttleTier ??
      'global'

    if (requestProps.throttler.name !== tier) {
      return true
    }

    return super.handleRequest(requestProps)
  }
}
