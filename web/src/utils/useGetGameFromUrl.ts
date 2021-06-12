import {
    useGetGameQuery
} from "../generated/graphql";
import { useGetIntId } from "./useGetIntId";

export const useGetGameFromUrl = () => {
  const intId = useGetIntId();
  return useGetGameQuery({
    skip: intId === -1,
    variables: {
      gameId: intId,
      
    },
    notifyOnNetworkStatusChange: true   
  });
};