import { DataSource } from "typeorm";
import { AppDataSource } from "../data-source";
import { Token } from "../entity/Token";

export class Writer {
  private dataSource: DataSource;

  constructor() {
    this.dataSource = AppDataSource;
  }

  public async writeToken(tokenAddress: string, hitsBanana: string, age: number) {
    const token = new Token();
    token.tokenAddress = tokenAddress;
    token.hitsBanana = hitsBanana;
    token.age = age;

    await this.dataSource.manager.save(token);
  }
}