// @flow

type _ExtractReturn<B, F: (...args: any[]) => B> = B;
export type ExtractReturn<F> = _ExtractReturn<*, F>;

// eslint-disable-next-line
export const actionGen = (type: string) => (args: { [string]: any } = {}) => ({ type, ...args })
