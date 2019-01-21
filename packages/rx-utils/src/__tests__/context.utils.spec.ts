import { Context, deferContext } from '../context.utils';
import { Sink } from '../sink.utils';
import { TestScheduler } from 'rxjs/testing';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';

describe('Context', () => {
	let scheduler: TestScheduler;
	beforeEach(() => {
		scheduler = new TestScheduler((a, b) => expect(a).toEqual(b));
	});
	afterEach(() => {
		scheduler.flush();
	});

	describe('deferContext', () => {
		type E = { foo: string; bar: number };
		const cb = jest.fn();
		const effect$ = of(undefined).pipe(tap(cb));
		const fa = new Context((e: E) => new Sink(e.foo, effect$));
		const split = deferContext(fa, 'foo');
		const fa1 = split.run({ bar: 123 });
		const fa2 = fa1.value.run({ foo: '123' });
		it('should', () => {
			fa2.sink$.subscribe();
			expect(cb).toBeCalled();
		});
	});
});
