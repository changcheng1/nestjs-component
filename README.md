<!--
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-04-23 18:06:54
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-05-08 09:06:49
 * @FilePath: /mvw_project/Users/changcheng/Desktop/nestjs/README.md
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
## create nest-cli

```javaScript

$ npm i -g @nestjs/cli
$ nest new project-name

```

## nest create module 

generate crud Module

```javaScript

nest g resource [name]

```

### docker

 Tags the image with the name my-nestjs-app.

 In this command:

 1. my-nestjs-app: Tags the image with the name my-nestjs-app.

 2. Indicates the current directory as the build context.

```
docker build -t my-nestjs-app .
```

### logger

Official document link

```

https://docs.nestjs.com/techniques/logger

recommand logger : winston

```
