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

  public async writeToken(tokenAddress: string, hitsBanana: number, hitsMaestro: number, date: Date) {
    const token = new Token();
    token.tokenAddress = tokenAddress.toLowerCase();
    token.hitsBanana = hitsBanana || 0;
    token.hitsMaestro = hitsMaestro;
    token.createdAt = date;
    

    await this.dataSource.manager.save(token);
  }

  public async deleteToken(tokenAddress: string) {
    tokenAddress = tokenAddress.toLowerCase();
    await this.dataSource.manager.delete(Token, { tokenAddress });
  }

  public async deleteMostRecentToken() {
    const mostRecentToken = await this.tokenRepository.find({
      order: {
        createdAt: "DESC"
      },
      take: 1
    });
    await this.dataSource.manager.delete(Token, { id: mostRecentToken[0].id });
  }

  public async getAllTokens() {
    return await this.tokenRepository.find();
  }

  public async findToken(tokenAddress: string) {
    tokenAddress = tokenAddress.toLowerCase();
    return await this.tokenRepository.findOneBy({ tokenAddress });
  }
}