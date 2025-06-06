import type { JSX } from "react";
import { LoginForm } from "../../modules/login/login-form";
import { makeRemoteLoadLogin } from "../../usecase/login/remote-load-login-factory";

export default function makeLoginForm (): JSX.Element {
  return (
    <LoginForm
     authentication={makeRemoteLoadLogin()}
    />
  )
}