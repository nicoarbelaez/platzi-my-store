import { DataTypes, Model, Sequelize } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

export const USER_TABLE = 'users';

export const UserSchema = {
  id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: () => uuidv4(),
  },
  email: {
    allowNull: false,
    type: DataTypes.STRING,
    unique: true,
  },
  password: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  recoveryToken: {
    field: 'recovery_token',
    allowNull: true,
    type: DataTypes.STRING,
  },
  role: {
    allowNull: false,
    type: DataTypes.STRING,
    defaultValue: 'customer',
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'created_at',
    defaultValue: Sequelize.NOW,
  },
};

export class User extends Model {
  static modelName = 'User';

  static associate(models) {
    this.hasOne(models.Customer, {
      as: 'customer',
      foreignKey: 'userId',
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: USER_TABLE,
      modelName: this.modelName,
      timestamps: false,
    };
  }
}
