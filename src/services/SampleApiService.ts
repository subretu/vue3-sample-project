import http from "@/http-common";

class SampleApiService {
  /* eslint @typescript-eslint/no-explicit-any: 0 */
  get(): Promise<any> {
    return http.get("/day");
  }

  get_userinfo(): Promise<any> {
    return http.get("/userinfo");
  }
}

export default new SampleApiService();
