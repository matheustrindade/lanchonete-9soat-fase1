import mysql from "mysql2/promise";
import DatabaseConnection from "./database-connection";

export default class MysqlAdapter implements DatabaseConnection {
  connection: any;
  async connect(): Promise<void> {
    try {
      this.connection = await mysql.createConnection(
        `mysql://root:admin@172.17.0.1:3306/fastfood`
      );
    } catch (error: any) {
      console.log("erro ao conectar ao banco de dados", error.message);
    }
  }
  async query(statement: string, params: any): Promise<any> {
    return this.connection.execute(statement, params);
  }
  async close(): Promise<void> {
    this.connection.end();
  }
}