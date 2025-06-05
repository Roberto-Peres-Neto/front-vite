import { RemoteAuthentication } from "@/data/usecases/authentication/remote-authentication";
import type { Authentication } from "@/domain/usecase/login";
import { makeApiUrl } from "../../http/api-uri-factory";
import { makeAxiosHttpClient } from "../../http/axios-http-client-factory";

export const makeRemoteLoadLogin = (): Authentication => {
  return new RemoteAuthentication(makeApiUrl("/erp-faveni/auth/login"), makeAxiosHttpClient());
}