/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-05-10 13:58:29
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-05-10 14:36:29
 * @FilePath: /myself-space/nestjs/src/user/dto/get-user-dto.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export interface GetUserDto {
  page: number;
  pageSize: number;
  username?: string;
  role?: number;
  gender?: string;
}
