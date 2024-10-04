import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameNotetagToNote1726933864900 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "note" RENAME COLUMN "note_tag" TO "tag"`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "note" RENAME COLUMN "tag" TO "note_tag"`,
        );
    }

}
