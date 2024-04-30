import http from "@/http-common";

class SampleApiService {
  /* eslint @typescript-eslint/no-explicit-any: 0 */
  get(): Promise<any> {
    return http.get("/day");
  }

  get_userinfo(): Promise<any> {
    return http.get("/userinfo");
  }

  upload_csv(data: any): Promise<any> {
    return http.post("/uploadcsv", data);
  }

  register_user(data: any): Promise<any> {
    return http.post("/register-user", data);
  }
}

export default new SampleApiService();
