import {
    useGetGameQuery
} from "../generated/graphql";
import { useGetIntId } from "./useGetIntId";

export const useGetGameFromUrl = () => {
  const intId = useGetIntId();
  return useGetGameQuery({
    pause: intId === -1,
    variables: {
      gameId: intId,
    },
  });
};