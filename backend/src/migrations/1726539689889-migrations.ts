import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1726539689889 implements MigrationInterface {
  name = 'Migrations1726539689889';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "drep" ("deletedAt" TIMESTAMP, "id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_93389e87db474ce96323b8882c8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "signature" ("id" SERIAL NOT NULL, "voterId" character varying, "stakeKey" character varying, "signature" character varying, "signatureKey" character varying, "drepId" integer, CONSTRAINT "PK_8e62734171afc1d7c9570be27fb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "note" ("deletedAt" TIMESTAMP, "id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying NOT NULL, "note_tag" text, "content" character varying NOT NULL, "visibility" character varying NOT NULL, "drepId" integer, "authorId" integer, CONSTRAINT "UQ_c1872643429ea977256802b0974" UNIQUE ("title"), CONSTRAINT "PK_96d0c172a4fba276b1bbed43058" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."comment_parententity_enum" AS ENUM('note', 'comment')`,
    );
    await queryRunner.query(
      `CREATE TABLE "comment" ("deletedAt" TIMESTAMP, "id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "content" character varying NOT NULL, "parentEntity" "public"."comment_parententity_enum" NOT NULL DEFAULT 'note', "parentId" integer NOT NULL, "voter" character varying NOT NULL, "noteId" integer, "commentId" integer, CONSTRAINT "PK_0b0e4bbc8415ec426f87f3a88e2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."reaction_type_enum" AS ENUM('like', 'thumbsup', 'thumbsdown', 'rocket')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."reaction_parententity_enum" AS ENUM('note', 'comment')`,
    );
    await queryRunner.query(
      `CREATE TABLE "reaction" ("deletedAt" TIMESTAMP, "id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "type" "public"."reaction_type_enum" NOT NULL DEFAULT 'like', "parentEntity" "public"."reaction_parententity_enum" NOT NULL DEFAULT 'note', "parentId" integer NOT NULL, "voter" character varying NOT NULL, "commentId" integer, CONSTRAINT "UQ_994f15da3179481b7c8fc8b516b" UNIQUE ("voter", "type", "parentId", "parentEntity"), CONSTRAINT "PK_41fbb346da22da4df129f14b11e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."attachment_parententity_enum" AS ENUM('drep', 'note', 'comment')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."attachment_attachmenttype_enum" AS ENUM('link', 'pdf', 'jpg', 'png', 'webp', 'gif', 'svg')`,
    );
    await queryRunner.query(
      `CREATE TABLE "attachment" ("deletedAt" TIMESTAMP, "id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "url" bytea NOT NULL, "parententity" "public"."attachment_parententity_enum" NOT NULL DEFAULT 'drep', "parentid" integer, "attachmentType" "public"."attachment_attachmenttype_enum" NOT NULL DEFAULT 'link', "noteId" integer, "drepId" integer, "commentId" integer, CONSTRAINT "UQ_10fe7469954f43bfc90e110d147" UNIQUE ("name"), CONSTRAINT "PK_d2a80c3a8d467f08a750ac4b420" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "signature" ADD CONSTRAINT "FK_0e364e8cdc69745eff2239269e4" FOREIGN KEY ("drepId") REFERENCES "drep"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "note" ADD CONSTRAINT "FK_270ca39118de4b28864f3de4d04" FOREIGN KEY ("drepId") REFERENCES "drep"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "note" ADD CONSTRAINT "FK_59d5801d406020527940335d902" FOREIGN KEY ("authorId") REFERENCES "signature"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" ADD CONSTRAINT "FK_3c3e1e8106c7edf8da2b312cd25" FOREIGN KEY ("noteId") REFERENCES "note"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" ADD CONSTRAINT "FK_1b03586f7af11eac99f4fdbf012" FOREIGN KEY ("commentId") REFERENCES "comment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reaction" ADD CONSTRAINT "FK_4584f851fc6471f517d9dad8966" FOREIGN KEY ("commentId") REFERENCES "comment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "attachment" ADD CONSTRAINT "FK_76c5cd056cd033bd8a9b6117bf4" FOREIGN KEY ("noteId") REFERENCES "note"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "attachment" ADD CONSTRAINT "FK_71304a733ad09e45fad47a425d8" FOREIGN KEY ("drepId") REFERENCES "drep"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "attachment" ADD CONSTRAINT "FK_48de432a2a403db1853ab431dc2" FOREIGN KEY ("commentId") REFERENCES "comment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "attachment" DROP CONSTRAINT "FK_48de432a2a403db1853ab431dc2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "attachment" DROP CONSTRAINT "FK_71304a733ad09e45fad47a425d8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "attachment" DROP CONSTRAINT "FK_76c5cd056cd033bd8a9b6117bf4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reaction" DROP CONSTRAINT "FK_4584f851fc6471f517d9dad8966"`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" DROP CONSTRAINT "FK_1b03586f7af11eac99f4fdbf012"`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" DROP CONSTRAINT "FK_3c3e1e8106c7edf8da2b312cd25"`,
    );
    await queryRunner.query(
      `ALTER TABLE "note" DROP CONSTRAINT "FK_59d5801d406020527940335d902"`,
    );
    await queryRunner.query(
      `ALTER TABLE "note" DROP CONSTRAINT "FK_270ca39118de4b28864f3de4d04"`,
    );
    await queryRunner.query(
      `ALTER TABLE "signature" DROP CONSTRAINT "FK_0e364e8cdc69745eff2239269e4"`,
    );
    await queryRunner.query(`DROP TABLE "attachment"`);
    await queryRunner.query(
      `DROP TYPE "public"."attachment_attachmenttype_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."attachment_parententity_enum"`,
    );
    await queryRunner.query(`DROP TABLE "reaction"`);
    await queryRunner.query(`DROP TYPE "public"."reaction_parententity_enum"`);
    await queryRunner.query(`DROP TYPE "public"."reaction_type_enum"`);
    await queryRunner.query(`DROP TABLE "comment"`);
    await queryRunner.query(`DROP TYPE "public"."comment_parententity_enum"`);
    await queryRunner.query(`DROP TABLE "note"`);
    await queryRunner.query(`DROP TABLE "signature"`);
    await queryRunner.query(`DROP TABLE "drep"`);
  }
}
