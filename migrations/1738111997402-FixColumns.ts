import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixColumns1738111997402 implements MigrationInterface {
    name = 'FixColumns1738111997402';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users"
            ADD "dateOfBirth" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "school_members"
            ADD "registration" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "classrooms"
            DROP CONSTRAINT "FK_55418280a71e7e220d89987ed8f"`);
        await queryRunner.query(`ALTER TABLE "classrooms"
            ALTER COLUMN "location" TYPE geometry`);
        await queryRunner.query(`ALTER TABLE "classrooms"
            ALTER COLUMN "schoolId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "articles"
            DROP CONSTRAINT "FK_65d9ccc1b02f4d904e90bd76a34"`);
        await queryRunner.query(`ALTER TABLE "articles"
            ALTER COLUMN "authorId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "subjects"
            DROP CONSTRAINT "FK_e97a33660b98bffe49e2431bb8c"`);
        await queryRunner.query(`ALTER TABLE "subjects"
            ALTER COLUMN "schoolId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "lectures"
            DROP CONSTRAINT "FK_b4515b36735a4987d26d23988db"`);
        await queryRunner.query(`ALTER TABLE "lectures"
            DROP CONSTRAINT "FK_f36b84a9e320363b2ca60afea6d"`);
        await queryRunner.query(`ALTER TABLE "lectures"
            DROP CONSTRAINT "FK_9fc4f6bfe04d0329f0d3390ea22"`);
        await queryRunner.query(`ALTER TABLE "lectures"
            ALTER COLUMN "schoolId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "lectures"
            ALTER COLUMN "subjectId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "lectures"
            ALTER COLUMN "classId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "classes"
            DROP CONSTRAINT "FK_17d36b6f6a79669ba76b671ac72"`);
        await queryRunner.query(`ALTER TABLE "classes"
            ALTER COLUMN "schoolId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "school_members"
            DROP CONSTRAINT "FK_b0e4d2a88605debd91e304a2186"`);
        await queryRunner.query(`ALTER TABLE "school_members"
            ALTER COLUMN "schoolId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "schools"
            ALTER COLUMN "location" TYPE geometry(Point)`);
        await queryRunner.query(`ALTER TABLE "classrooms"
            ADD CONSTRAINT "FK_55418280a71e7e220d89987ed8f" FOREIGN KEY ("schoolId") REFERENCES "schools" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "articles"
            ADD CONSTRAINT "FK_65d9ccc1b02f4d904e90bd76a34" FOREIGN KEY ("authorId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subjects"
            ADD CONSTRAINT "FK_e97a33660b98bffe49e2431bb8c" FOREIGN KEY ("schoolId") REFERENCES "schools" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lectures"
            ADD CONSTRAINT "FK_b4515b36735a4987d26d23988db" FOREIGN KEY ("schoolId") REFERENCES "schools" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lectures"
            ADD CONSTRAINT "FK_f36b84a9e320363b2ca60afea6d" FOREIGN KEY ("subjectId") REFERENCES "subjects" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lectures"
            ADD CONSTRAINT "FK_9fc4f6bfe04d0329f0d3390ea22" FOREIGN KEY ("classId") REFERENCES "classes" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "classes"
            ADD CONSTRAINT "FK_17d36b6f6a79669ba76b671ac72" FOREIGN KEY ("schoolId") REFERENCES "schools" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "school_members"
            ADD CONSTRAINT "FK_b0e4d2a88605debd91e304a2186" FOREIGN KEY ("schoolId") REFERENCES "schools" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "school_members"
            DROP CONSTRAINT "FK_b0e4d2a88605debd91e304a2186"`);
        await queryRunner.query(`ALTER TABLE "classes"
            DROP CONSTRAINT "FK_17d36b6f6a79669ba76b671ac72"`);
        await queryRunner.query(`ALTER TABLE "lectures"
            DROP CONSTRAINT "FK_9fc4f6bfe04d0329f0d3390ea22"`);
        await queryRunner.query(`ALTER TABLE "lectures"
            DROP CONSTRAINT "FK_f36b84a9e320363b2ca60afea6d"`);
        await queryRunner.query(`ALTER TABLE "lectures"
            DROP CONSTRAINT "FK_b4515b36735a4987d26d23988db"`);
        await queryRunner.query(`ALTER TABLE "subjects"
            DROP CONSTRAINT "FK_e97a33660b98bffe49e2431bb8c"`);
        await queryRunner.query(`ALTER TABLE "articles"
            DROP CONSTRAINT "FK_65d9ccc1b02f4d904e90bd76a34"`);
        await queryRunner.query(`ALTER TABLE "classrooms"
            DROP CONSTRAINT "FK_55418280a71e7e220d89987ed8f"`);
        await queryRunner.query(`ALTER TABLE "schools"
            ALTER COLUMN "location" TYPE geometry(GEOMETRY, 0)`);
        await queryRunner.query(`ALTER TABLE "school_members"
            ALTER COLUMN "schoolId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "school_members"
            ADD CONSTRAINT "FK_b0e4d2a88605debd91e304a2186" FOREIGN KEY ("schoolId") REFERENCES "schools" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "classes"
            ALTER COLUMN "schoolId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "classes"
            ADD CONSTRAINT "FK_17d36b6f6a79669ba76b671ac72" FOREIGN KEY ("schoolId") REFERENCES "schools" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lectures"
            ALTER COLUMN "classId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "lectures"
            ALTER COLUMN "subjectId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "lectures"
            ALTER COLUMN "schoolId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "lectures"
            ADD CONSTRAINT "FK_9fc4f6bfe04d0329f0d3390ea22" FOREIGN KEY ("classId") REFERENCES "classes" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lectures"
            ADD CONSTRAINT "FK_f36b84a9e320363b2ca60afea6d" FOREIGN KEY ("subjectId") REFERENCES "subjects" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lectures"
            ADD CONSTRAINT "FK_b4515b36735a4987d26d23988db" FOREIGN KEY ("schoolId") REFERENCES "schools" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subjects"
            ALTER COLUMN "schoolId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "subjects"
            ADD CONSTRAINT "FK_e97a33660b98bffe49e2431bb8c" FOREIGN KEY ("schoolId") REFERENCES "schools" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "articles"
            ALTER COLUMN "authorId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "articles"
            ADD CONSTRAINT "FK_65d9ccc1b02f4d904e90bd76a34" FOREIGN KEY ("authorId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "classrooms"
            ALTER COLUMN "schoolId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "classrooms"
            ALTER COLUMN "location" TYPE geometry(GEOMETRY, 0)`);
        await queryRunner.query(`ALTER TABLE "classrooms"
            ADD CONSTRAINT "FK_55418280a71e7e220d89987ed8f" FOREIGN KEY ("schoolId") REFERENCES "schools" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "school_members"
            DROP COLUMN "registration"`);
        await queryRunner.query(`ALTER TABLE "users"
            DROP COLUMN "dateOfBirth"`);
    }
}
