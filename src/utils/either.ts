export type Either<L, R> = Left<L> | Right<R>

export type Left<L> = {
  readonly _tag: 'Left'
  readonly value: L
  readonly isLeft: true
  readonly isRight: false
}

export type Right<R> = {
  readonly _tag: 'Right'
  readonly value: R
  readonly isLeft: false
  readonly isRight: true
}

export const left = <L, R>(value: L): Either<L, R> => ({
  _tag: 'Left',
  value,
  isLeft: true,
  isRight: false,
})

export const right = <L, R>(value: R): Either<L, R> => ({
  _tag: 'Right',
  value,
  isLeft: false,
  isRight: true,
})
