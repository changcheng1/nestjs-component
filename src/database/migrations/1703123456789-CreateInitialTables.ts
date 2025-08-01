import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInitialTables1703123456789 implements MigrationInterface {
  name = 'CreateInitialTables1703123456789';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 创建用户表
    await queryRunner.query(`
            CREATE TABLE \`user\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`username\` varchar(20) NOT NULL,
                \`password\` varchar(255) NOT NULL,
                \`deleted_at\` datetime(6) NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE=InnoDB
        `);

    // 创建角色表
    await queryRunner.query(`
            CREATE TABLE \`role\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`name\` varchar(255) NOT NULL,
                \`description\` varchar(255) NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE=InnoDB
        `);

    // 创建用户角色关联表
    await queryRunner.query(`
            CREATE TABLE \`user_roles\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`user_id\` int NOT NULL,
                \`role_id\` int NOT NULL,
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                PRIMARY KEY (\`id\`)
            ) ENGINE=InnoDB
        `);

    // 创建菜单表
    await queryRunner.query(`
            CREATE TABLE \`menu\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`name\` varchar(255) NOT NULL,
                \`path\` varchar(255) NOT NULL,
                \`acl\` varchar(255) NOT NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE=InnoDB
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 回滚操作 - 删除表（注意顺序，先删除有外键依赖的表）
    await queryRunner.query(`DROP TABLE \`menu\``);
    await queryRunner.query(`DROP TABLE \`user_roles\``);
    await queryRunner.query(`DROP TABLE \`role\``);
    await queryRunner.query(`DROP TABLE \`user\``);
  }
}
