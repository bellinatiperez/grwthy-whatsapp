import { of } from 'rxjs';
import { LoggingInterceptor } from './logging.interceptor';

describe('LoggingInterceptor', () => {
  let interceptor: LoggingInterceptor;

  beforeEach(() => {
    interceptor = new LoggingInterceptor();
  });

  it('should call next.handle and return observable', (done) => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({ method: 'GET', url: '/test' }),
      }),
    } as any;

    const next = { handle: () => of({ data: 'ok' }) };

    interceptor.intercept(context, next).subscribe((result) => {
      expect(result).toEqual({ data: 'ok' });
      done();
    });
  });

  it('should pass through the response unchanged', (done) => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({ method: 'POST', url: '/api/test' }),
      }),
    } as any;

    const responseData = { id: 1, name: 'test' };
    const next = { handle: () => of(responseData) };

    interceptor.intercept(context, next).subscribe((result) => {
      expect(result).toBe(responseData);
      done();
    });
  });
});
