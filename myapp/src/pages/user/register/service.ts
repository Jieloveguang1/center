import {register} from "@/services/ant-design-pro/api";


export async function RealRegister(params: API.RegisterParams) {
  return register(params)
}
