import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm"

@Entity()
export class Token {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    tokenAddress: string

    @Column()
    hitsBanana: number

    @Column()
    hitsMaestro: number

    @CreateDateColumn()
    createdAt: Date
}
