import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
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
    & RegularUserResponseFragment
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
    & RegularUserResponseFragment
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

export const GameFragmentFragmentDoc = gql`
    fragment GameFragment on Game {
  initialWord
  gameField {
    gameId
    letters {
      char
      boxNumber
    }
  }
  players {
    id
  }
  scoreP1
  scoreP2
  createdAt
  status
}
    `;
export const RegularErrorFragmentDoc = gql`
    fragment RegularError on FieldError {
  field
  message
}
    `;
export const RegularUserFragmentDoc = gql`
    fragment RegularUser on User {
  id
  username
}
    `;
export const RegularUserResponseFragmentDoc = gql`
    fragment RegularUserResponse on UserResponse {
  errors {
    ...RegularError
  }
  user {
    ...RegularUser
  }
}
    ${RegularErrorFragmentDoc}
${RegularUserFragmentDoc}`;
export const ConnectDocument = gql`
    mutation Connect($gameId: Float!) {
  connectToGame(gameId: $gameId) {
    createdAt
    scoreP1
    scoreP2
    initialWord
    status
  }
}
    `;

export function useConnectMutation() {
  return Urql.useMutation<ConnectMutation, ConnectMutationVariables>(ConnectDocument);
};
export const CreateGameDocument = gql`
    mutation createGame {
  createGame {
    initialWord
    id
    status
    players {
      id
    }
  }
}
    `;

export function useCreateGameMutation() {
  return Urql.useMutation<CreateGameMutation, CreateGameMutationVariables>(CreateGameDocument);
};
export const GenerateDocument = gql`
    mutation generate($gameId: Float!) {
  generateField(gameId: $gameId) {
    gameId
    letters {
      char
    }
  }
}
    `;

export function useGenerateMutation() {
  return Urql.useMutation<GenerateMutation, GenerateMutationVariables>(GenerateDocument);
};
export const LoginDocument = gql`
    mutation Login($usernameOrEmail: String!, $password: String!) {
  login(usernameOrEmail: $usernameOrEmail, password: $password) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
};
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;

export function useLogoutMutation() {
  return Urql.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument);
};
export const MakeTurnDocument = gql`
    mutation MakeTurn($confirmed: Boolean, $word: [CellInput!]!, $gameId: Float!) {
  makeTurn(confirmed: $confirmed, word: $word, gameId: $gameId) {
    ...GameFragment
  }
}
    ${GameFragmentFragmentDoc}`;

export function useMakeTurnMutation() {
  return Urql.useMutation<MakeTurnMutation, MakeTurnMutationVariables>(MakeTurnDocument);
};
export const RegisterDocument = gql`
    mutation Register($options: UsernamePasswordInput!) {
  register(options: $options) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;

export function useRegisterMutation() {
  return Urql.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument);
};
export const GetGameDocument = gql`
    query getGame($gameId: Float!) {
  getGame(gameId: $gameId) {
    ...GameFragment
  }
}
    ${GameFragmentFragmentDoc}`;

export function useGetGameQuery(options: Omit<Urql.UseQueryArgs<GetGameQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetGameQuery>({ query: GetGameDocument, ...options });
};
export const GetGameHistoryDocument = gql`
    query getGameHistory {
  getGameHistory {
    id
    initialWord
    status
    scoreP1
    scoreP2
    players {
      id
    }
    currentTurn
    gameField {
      letters {
        char
      }
    }
  }
}
    `;

export function useGetGameHistoryQuery(options: Omit<Urql.UseQueryArgs<GetGameHistoryQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetGameHistoryQuery>({ query: GetGameHistoryDocument, ...options });
};
export const LoadFieldDocument = gql`
    query loadField($gameId: Float!) {
  loadField(gameId: $gameId) {
    gameId
    letters {
      char
      boxNumber
    }
  }
}
    `;

export function useLoadFieldQuery(options: Omit<Urql.UseQueryArgs<LoadFieldQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<LoadFieldQuery>({ query: LoadFieldDocument, ...options });
};
export const MeDocument = gql`
    query Me {
  me {
    ...RegularUser
  }
}
    ${RegularUserFragmentDoc}`;

export function useMeQuery(options: Omit<Urql.UseQueryArgs<MeQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<MeQuery>({ query: MeDocument, ...options });
};