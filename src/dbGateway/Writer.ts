import { DataSource, Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Token } from "../entity/Token";

export class Writer {
  private dataSource: DataSource;
  private tokenRepository: Repository < Token >;

  constructor() {
    this.dataSource = AppDataSource;
    this.tokenRepository = this.dataSource.manager.getRepository(Token);
  }

  public async writeToken(tokenAddress: string, hitsBanana: number, hitsMaestro: number) {
    const token = new Token();
    token.tokenAddress = tokenAddress.toLowerCase();
    token.hitsBanana = hitsBanana || 0;
    token.hitsMaestro = hitsMaestro;

    await this.dataSource.manager.save(token);
  }

  public async deleteToken(tokenAddress: string) {
    tokenAddress = tokenAddress.toLowerCase();
    await this.dataSource.manager.delete(Token, { tokenAddress });
  }

  public async getAllTokens() {
    return await this.tokenRepository.find();
  }

  public async findToken(tokenAddress: string) {
    tokenAddress = tokenAddress.toLowerCase();
    return await this.tokenRepository.findOneBy({ tokenAddress });
  }
}