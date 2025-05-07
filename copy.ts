/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-04-26 17:14:40
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-04-27 13:34:20
 * @FilePath: /mvw_project/Users/changcheng/Desktop/nestjs/copy.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import * as shelljs from 'shelljs';
shelljs.cp('-R', './env.production.yml', 'dist/src');
