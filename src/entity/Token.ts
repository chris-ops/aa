import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Token {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    tokenAddress: string

    @Column()
    hitsBanana: string

    @Column()
    age: number

}
