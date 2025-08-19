import { DataSource } from 'typeorm';
import { User } from './src/database/entities/user.entity';
import { Role } from './src/database/entities/role.entity';
import { Profile } from './src/database/entities/profile.entity';
import { Logs } from './src/database/entities/logs.entity';
import { Institution } from './src/database/entities/institution.entity';
import { UserRole } from './src/database/entities/user-role.entity';
import { UserProfile } from './src/database/entities/user-profile.entity';
import { Menu } from './src/database/entities/menu.entity';

export default new DataSource({
  type: 'mysql',
  host: '127.0.0.1',
  port: 3306,
  username: 'root',
  password: '000000',
  database: 'nestjsdb',
  entities: [
    User,
    Role,
    Profile,
    Logs,
    Institution,
    UserRole,
    UserProfile,
    Menu,
  ],
  migrations: ['src/database/migrations/*.ts'],
  migrationsTableName: 'migrations',
});
