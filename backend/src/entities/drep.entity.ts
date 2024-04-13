import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Drep {
    //auto increment primary key decorator
    @PrimaryGeneratedColumn()
    id: number
    //Human readable name for the entity
    @Column({unique: true, nullable: false})
    name: string
    //More info about the drep
    @Column({})
    bio: string
    //Platform statement associated with the user
    @Column({nullable: false})
    platform_statement: string
    //Information about the user's expertise
    @Column({})
    expertise: string
    //User's perspective within the decentralized system
    @Column({})
    perspective: string

    //DB triggers, triggers a function to autorun if a column has been provided in the req body
    //use BeforeInsert decorator
}