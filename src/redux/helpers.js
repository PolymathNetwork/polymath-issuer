// @flow

// eslint-disable-next-line no-unused-vars
type _ExtractReturn<B, F: (...args: any[]) => B> = B
export type ExtractReturn<F> = _ExtractReturn<*, F>
