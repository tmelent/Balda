import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
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
  p1wordlist?: Maybe<Array<Scalars['String']>>;
  p2wordlist?: Maybe<Array<Scalars['String']>>;
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
  & Pick<Game, 'initialWord' | 'scoreP1' | 'scoreP2' | 'p1wordlist' | 'p2wordlist' | 'createdAt' | 'status' | 'currentTurn'>
  & { gameField: (
    { __typename?: 'GameField' }
    & Pick<GameField, 'gameId'>
    & { letters: Array<(
      { __typename?: 'Letter' }
      & Pick<Letter, 'id' | 'char' | 'boxNumber' | 'filled' | 'isNew'>
    )> }
  ), players?: Maybe<Array<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'username'>
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

export type ChangePasswordMutationVariables = Exact<{
  token: Scalars['String'];
  newPassword: Scalars['String'];
}>;


export type ChangePasswordMutation = (
  { __typename?: 'Mutation' }
  & { changePassword: (
    { __typename?: 'UserResponse' }
    & RegularUserResponseFragment
  ) }
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

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type ForgotPasswordMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'forgotPassword'>
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
      id
      char
      boxNumber
      filled
      isNew
    }
  }
  players {
    id
    username
  }
  scoreP1
  scoreP2
  p1wordlist
  p2wordlist
  createdAt
  status
  currentTurn
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
export const ChangePasswordDocument = gql`
    mutation ChangePassword($token: String!, $newPassword: String!) {
  changePassword(token: $token, newPassword: $newPassword) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;
export type ChangePasswordMutationFn = Apollo.MutationFunction<ChangePasswordMutation, ChangePasswordMutationVariables>;

/**
 * __useChangePasswordMutation__
 *
 * To run a mutation, you first call `useChangePasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangePasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changePasswordMutation, { data, loading, error }] = useChangePasswordMutation({
 *   variables: {
 *      token: // value for 'token'
 *      newPassword: // value for 'newPassword'
 *   },
 * });
 */
export function useChangePasswordMutation(baseOptions?: Apollo.MutationHookOptions<ChangePasswordMutation, ChangePasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(ChangePasswordDocument, options);
      }
export type ChangePasswordMutationHookResult = ReturnType<typeof useChangePasswordMutation>;
export type ChangePasswordMutationResult = Apollo.MutationResult<ChangePasswordMutation>;
export type ChangePasswordMutationOptions = Apollo.BaseMutationOptions<ChangePasswordMutation, ChangePasswordMutationVariables>;
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
export type ConnectMutationFn = Apollo.MutationFunction<ConnectMutation, ConnectMutationVariables>;

/**
 * __useConnectMutation__
 *
 * To run a mutation, you first call `useConnectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useConnectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [connectMutation, { data, loading, error }] = useConnectMutation({
 *   variables: {
 *      gameId: // value for 'gameId'
 *   },
 * });
 */
export function useConnectMutation(baseOptions?: Apollo.MutationHookOptions<ConnectMutation, ConnectMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ConnectMutation, ConnectMutationVariables>(ConnectDocument, options);
      }
export type ConnectMutationHookResult = ReturnType<typeof useConnectMutation>;
export type ConnectMutationResult = Apollo.MutationResult<ConnectMutation>;
export type ConnectMutationOptions = Apollo.BaseMutationOptions<ConnectMutation, ConnectMutationVariables>;
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
export type CreateGameMutationFn = Apollo.MutationFunction<CreateGameMutation, CreateGameMutationVariables>;

/**
 * __useCreateGameMutation__
 *
 * To run a mutation, you first call `useCreateGameMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateGameMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createGameMutation, { data, loading, error }] = useCreateGameMutation({
 *   variables: {
 *   },
 * });
 */
export function useCreateGameMutation(baseOptions?: Apollo.MutationHookOptions<CreateGameMutation, CreateGameMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateGameMutation, CreateGameMutationVariables>(CreateGameDocument, options);
      }
export type CreateGameMutationHookResult = ReturnType<typeof useCreateGameMutation>;
export type CreateGameMutationResult = Apollo.MutationResult<CreateGameMutation>;
export type CreateGameMutationOptions = Apollo.BaseMutationOptions<CreateGameMutation, CreateGameMutationVariables>;
export const ForgotPasswordDocument = gql`
    mutation ForgotPassword($email: String!) {
  forgotPassword(email: $email)
}
    `;
export type ForgotPasswordMutationFn = Apollo.MutationFunction<ForgotPasswordMutation, ForgotPasswordMutationVariables>;

/**
 * __useForgotPasswordMutation__
 *
 * To run a mutation, you first call `useForgotPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useForgotPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [forgotPasswordMutation, { data, loading, error }] = useForgotPasswordMutation({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useForgotPasswordMutation(baseOptions?: Apollo.MutationHookOptions<ForgotPasswordMutation, ForgotPasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ForgotPasswordMutation, ForgotPasswordMutationVariables>(ForgotPasswordDocument, options);
      }
export type ForgotPasswordMutationHookResult = ReturnType<typeof useForgotPasswordMutation>;
export type ForgotPasswordMutationResult = Apollo.MutationResult<ForgotPasswordMutation>;
export type ForgotPasswordMutationOptions = Apollo.BaseMutationOptions<ForgotPasswordMutation, ForgotPasswordMutationVariables>;
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
export type GenerateMutationFn = Apollo.MutationFunction<GenerateMutation, GenerateMutationVariables>;

/**
 * __useGenerateMutation__
 *
 * To run a mutation, you first call `useGenerateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGenerateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [generateMutation, { data, loading, error }] = useGenerateMutation({
 *   variables: {
 *      gameId: // value for 'gameId'
 *   },
 * });
 */
export function useGenerateMutation(baseOptions?: Apollo.MutationHookOptions<GenerateMutation, GenerateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<GenerateMutation, GenerateMutationVariables>(GenerateDocument, options);
      }
export type GenerateMutationHookResult = ReturnType<typeof useGenerateMutation>;
export type GenerateMutationResult = Apollo.MutationResult<GenerateMutation>;
export type GenerateMutationOptions = Apollo.BaseMutationOptions<GenerateMutation, GenerateMutationVariables>;
export const LoginDocument = gql`
    mutation Login($usernameOrEmail: String!, $password: String!) {
  login(usernameOrEmail: $usernameOrEmail, password: $password) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      usernameOrEmail: // value for 'usernameOrEmail'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;
export type LogoutMutationFn = Apollo.MutationFunction<LogoutMutation, LogoutMutationVariables>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(baseOptions?: Apollo.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, options);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;
export const MakeTurnDocument = gql`
    mutation MakeTurn($confirmed: Boolean, $word: [CellInput!]!, $gameId: Float!) {
  makeTurn(confirmed: $confirmed, word: $word, gameId: $gameId) {
    ...GameFragment
  }
}
    ${GameFragmentFragmentDoc}`;
export type MakeTurnMutationFn = Apollo.MutationFunction<MakeTurnMutation, MakeTurnMutationVariables>;

/**
 * __useMakeTurnMutation__
 *
 * To run a mutation, you first call `useMakeTurnMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMakeTurnMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [makeTurnMutation, { data, loading, error }] = useMakeTurnMutation({
 *   variables: {
 *      confirmed: // value for 'confirmed'
 *      word: // value for 'word'
 *      gameId: // value for 'gameId'
 *   },
 * });
 */
export function useMakeTurnMutation(baseOptions?: Apollo.MutationHookOptions<MakeTurnMutation, MakeTurnMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<MakeTurnMutation, MakeTurnMutationVariables>(MakeTurnDocument, options);
      }
export type MakeTurnMutationHookResult = ReturnType<typeof useMakeTurnMutation>;
export type MakeTurnMutationResult = Apollo.MutationResult<MakeTurnMutation>;
export type MakeTurnMutationOptions = Apollo.BaseMutationOptions<MakeTurnMutation, MakeTurnMutationVariables>;
export const RegisterDocument = gql`
    mutation Register($options: UsernamePasswordInput!) {
  register(options: $options) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;
export type RegisterMutationFn = Apollo.MutationFunction<RegisterMutation, RegisterMutationVariables>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      options: // value for 'options'
 *   },
 * });
 */
export function useRegisterMutation(baseOptions?: Apollo.MutationHookOptions<RegisterMutation, RegisterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, options);
      }
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = Apollo.BaseMutationOptions<RegisterMutation, RegisterMutationVariables>;
export const GetGameDocument = gql`
    query getGame($gameId: Float!) {
  getGame(gameId: $gameId) {
    ...GameFragment
  }
}
    ${GameFragmentFragmentDoc}`;

/**
 * __useGetGameQuery__
 *
 * To run a query within a React component, call `useGetGameQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetGameQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetGameQuery({
 *   variables: {
 *      gameId: // value for 'gameId'
 *   },
 * });
 */
export function useGetGameQuery(baseOptions: Apollo.QueryHookOptions<GetGameQuery, GetGameQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetGameQuery, GetGameQueryVariables>(GetGameDocument, options);
      }
export function useGetGameLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetGameQuery, GetGameQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetGameQuery, GetGameQueryVariables>(GetGameDocument, options);
        }
export type GetGameQueryHookResult = ReturnType<typeof useGetGameQuery>;
export type GetGameLazyQueryHookResult = ReturnType<typeof useGetGameLazyQuery>;
export type GetGameQueryResult = Apollo.QueryResult<GetGameQuery, GetGameQueryVariables>;
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

/**
 * __useGetGameHistoryQuery__
 *
 * To run a query within a React component, call `useGetGameHistoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetGameHistoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetGameHistoryQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetGameHistoryQuery(baseOptions?: Apollo.QueryHookOptions<GetGameHistoryQuery, GetGameHistoryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetGameHistoryQuery, GetGameHistoryQueryVariables>(GetGameHistoryDocument, options);
      }
export function useGetGameHistoryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetGameHistoryQuery, GetGameHistoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetGameHistoryQuery, GetGameHistoryQueryVariables>(GetGameHistoryDocument, options);
        }
export type GetGameHistoryQueryHookResult = ReturnType<typeof useGetGameHistoryQuery>;
export type GetGameHistoryLazyQueryHookResult = ReturnType<typeof useGetGameHistoryLazyQuery>;
export type GetGameHistoryQueryResult = Apollo.QueryResult<GetGameHistoryQuery, GetGameHistoryQueryVariables>;
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

/**
 * __useLoadFieldQuery__
 *
 * To run a query within a React component, call `useLoadFieldQuery` and pass it any options that fit your needs.
 * When your component renders, `useLoadFieldQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLoadFieldQuery({
 *   variables: {
 *      gameId: // value for 'gameId'
 *   },
 * });
 */
export function useLoadFieldQuery(baseOptions: Apollo.QueryHookOptions<LoadFieldQuery, LoadFieldQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<LoadFieldQuery, LoadFieldQueryVariables>(LoadFieldDocument, options);
      }
export function useLoadFieldLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<LoadFieldQuery, LoadFieldQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<LoadFieldQuery, LoadFieldQueryVariables>(LoadFieldDocument, options);
        }
export type LoadFieldQueryHookResult = ReturnType<typeof useLoadFieldQuery>;
export type LoadFieldLazyQueryHookResult = ReturnType<typeof useLoadFieldLazyQuery>;
export type LoadFieldQueryResult = Apollo.QueryResult<LoadFieldQuery, LoadFieldQueryVariables>;
export const MeDocument = gql`
    query Me {
  me {
    ...RegularUser
  }
}
    ${RegularUserFragmentDoc}`;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;