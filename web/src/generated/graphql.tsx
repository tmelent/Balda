export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type CellInput = {
  boxNumber: Scalars['Int'];
  char: Scalars['String'];
  filled: Scalars['Boolean'];
  isNew: Scalars['Boolean'];
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type Game = {
  __typename?: 'Game';
  id: Scalars['Float'];
  createdAt: Scalars['String'];
  scoreP1?: Maybe<Scalars['Int']>;
  scoreP2?: Maybe<Scalars['Int']>;
  initialWord: Scalars['String'];
  currentTurn?: Maybe<Scalars['Float']>;
  status?: Maybe<Scalars['Boolean']>;
  players?: Maybe<Array<User>>;
  gameField: GameField;
};

export type GameField = {
  __typename?: 'GameField';
  gameId: Scalars['Float'];
  letters: Array<Letter>;
};

export type Letter = {
  __typename?: 'Letter';
  id: Scalars['Float'];
  boxNumber: Scalars['Float'];
  char: Scalars['String'];
  filled: Scalars['Boolean'];
  isNew: Scalars['Boolean'];
};

export type Mutation = {
  __typename?: 'Mutation';
  connectToGame: Game;
  makeTurn: Game;
  createGame: Game;
  generateField?: Maybe<GameField>;
  changePassword: UserResponse;
  forgotPassword: Scalars['Boolean'];
  register: UserResponse;
  login: UserResponse;
  logout: Scalars['Boolean'];
};


export type MutationConnectToGameArgs = {
  gameId: Scalars['Float'];
};


export type MutationMakeTurnArgs = {
  confirmed?: Maybe<Scalars['Boolean']>;
  word: Array<CellInput>;
  gameId: Scalars['Float'];
};


export type MutationGenerateFieldArgs = {
  gameId: Scalars['Float'];
};


export type MutationChangePasswordArgs = {
  newPassword: Scalars['String'];
  token: Scalars['String'];
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String'];
};


export type MutationRegisterArgs = {
  options: UsernamePasswordInput;
};


export type MutationLoginArgs = {
  password: Scalars['String'];
  usernameOrEmail: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  getGame?: Maybe<Game>;
  getGameHistory?: Maybe<Array<Game>>;
  loadField?: Maybe<GameField>;
  me?: Maybe<User>;
};


export type QueryGetGameArgs = {
  gameId: Scalars['Float'];
};


export type QueryLoadFieldArgs = {
  gameId: Scalars['Float'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['Float'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  username: Scalars['String'];
  email: Scalars['String'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type UsernamePasswordInput = {
  email: Scalars['String'];
  username: Scalars['String'];
  password: Scalars['String'];
};

export type GameFragmentFragment = (
  { __typename?: 'Game' }
  & Pick<Game, 'initialWord' | 'scoreP1' | 'scoreP2' | 'createdAt' | 'status'>
  & { gameField: (
    { __typename?: 'GameField' }
    & Pick<GameField, 'gameId'>
    & { letters: Array<(
      { __typename?: 'Letter' }
      & Pick<Letter, 'char' | 'boxNumber'>
    )> }
  ), players?: Maybe<Array<(
    { __typename?: 'User' }
    & Pick<User, 'id'>
  )>> }
);

export type RegularErrorFragment = (
  { __typename?: 'FieldError' }
  & Pick<FieldError, 'field' | 'message'>
);

export type RegularUserFragment = (
  { __typename?: 'User' }
  & Pick<User, 'id' | 'username'>
);

export type RegularUserResponseFragment = (
  { __typename?: 'UserResponse' }
  & { errors?: Maybe<Array<(
    { __typename?: 'FieldError' }
    & RegularErrorFragment
  )>>, user?: Maybe<(
    { __typename?: 'User' }
    & RegularUserFragment
  )> }
);

export type ConnectMutationVariables = Exact<{
  gameId: Scalars['Float'];
}>;


export type ConnectMutation = (
  { __typename?: 'Mutation' }
  & { connectToGame: (
    { __typename?: 'Game' }
    & Pick<Game, 'createdAt' | 'scoreP1' | 'scoreP2' | 'initialWord' | 'status'>
  ) }
);

export type CreateGameMutationVariables = Exact<{ [key: string]: never; }>;


export type CreateGameMutation = (
  { __typename?: 'Mutation' }
  & { createGame: (
    { __typename?: 'Game' }
    & Pick<Game, 'initialWord' | 'id' | 'status'>
    & { players?: Maybe<Array<(
      { __typename?: 'User' }
      & Pick<User, 'id'>
    )>> }
  ) }
);

export type GenerateMutationVariables = Exact<{
  gameId: Scalars['Float'];
}>;


export type GenerateMutation = (
  { __typename?: 'Mutation' }
  & { generateField?: Maybe<(
    { __typename?: 'GameField' }
    & Pick<GameField, 'gameId'>
    & { letters: Array<(
      { __typename?: 'Letter' }
      & Pick<Letter, 'char'>
    )> }
  )> }
);

export type LoginMutationVariables = Exact<{
  usernameOrEmail: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'UserResponse' }
    & { user?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'username'>
    )> }
  ) }
);

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'logout'>
);

export type MakeTurnMutationVariables = Exact<{
  confirmed?: Maybe<Scalars['Boolean']>;
  word: Array<CellInput> | CellInput;
  gameId: Scalars['Float'];
}>;


export type MakeTurnMutation = (
  { __typename?: 'Mutation' }
  & { makeTurn: (
    { __typename?: 'Game' }
    & GameFragmentFragment
  ) }
);

export type RegisterMutationVariables = Exact<{
  options: UsernamePasswordInput;
}>;


export type RegisterMutation = (
  { __typename?: 'Mutation' }
  & { register: (
    { __typename?: 'UserResponse' }
    & { user?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'username'>
    )> }
  ) }
);

export type GetGameQueryVariables = Exact<{
  gameId: Scalars['Float'];
}>;


export type GetGameQuery = (
  { __typename?: 'Query' }
  & { getGame?: Maybe<(
    { __typename?: 'Game' }
    & GameFragmentFragment
  )> }
);

export type GetGameHistoryQueryVariables = Exact<{ [key: string]: never; }>;


export type GetGameHistoryQuery = (
  { __typename?: 'Query' }
  & { getGameHistory?: Maybe<Array<(
    { __typename?: 'Game' }
    & Pick<Game, 'id' | 'initialWord' | 'status' | 'scoreP1' | 'scoreP2' | 'currentTurn'>
    & { players?: Maybe<Array<(
      { __typename?: 'User' }
      & Pick<User, 'id'>
    )>>, gameField: (
      { __typename?: 'GameField' }
      & { letters: Array<(
        { __typename?: 'Letter' }
        & Pick<Letter, 'char'>
      )> }
    ) }
  )>> }
);

export type LoadFieldQueryVariables = Exact<{
  gameId: Scalars['Float'];
}>;


export type LoadFieldQuery = (
  { __typename?: 'Query' }
  & { loadField?: Maybe<(
    { __typename?: 'GameField' }
    & Pick<GameField, 'gameId'>
    & { letters: Array<(
      { __typename?: 'Letter' }
      & Pick<Letter, 'char' | 'boxNumber'>
    )> }
  )> }
);

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = (
  { __typename?: 'Query' }
  & { me?: Maybe<(
    { __typename?: 'User' }
    & RegularUserFragment
  )> }
);
