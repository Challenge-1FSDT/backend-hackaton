import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1738968355408 implements MigrationInterface {
    name = 'Migrations1738968355408'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subject_teachers" DROP CONSTRAINT "FK_02fbf0a593253d6360c2998c517"`);
        await queryRunner.query(`ALTER TABLE "subject_teachers" DROP CONSTRAINT "FK_74011f8490d13c92ee9bb9c0138"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_74011f8490d13c92ee9bb9c013"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_02fbf0a593253d6360c2998c51"`);
        await queryRunner.query(`CREATE TABLE "comments" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "post" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "schoolId" integer NOT NULL, "lectureId" integer NOT NULL, "parentId" integer, "authorId" integer NOT NULL, CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "subject_teachers" DROP CONSTRAINT "PK_0e62cb869ca1ab55bece9acc59e"`);
        await queryRunner.query(`ALTER TABLE "subject_teachers" ADD CONSTRAINT "PK_74011f8490d13c92ee9bb9c0138" PRIMARY KEY ("schoolMembersId")`);
        await queryRunner.query(`ALTER TABLE "subject_teachers" DROP COLUMN "subjectsId"`);
        await queryRunner.query(`ALTER TABLE "subject_teachers" DROP CONSTRAINT "PK_74011f8490d13c92ee9bb9c0138"`);
        await queryRunner.query(`ALTER TABLE "subject_teachers" DROP COLUMN "schoolMembersId"`);
        await queryRunner.query(`ALTER TABLE "class_students" ADD "schoolId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "subject_teachers" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "subject_teachers" ADD CONSTRAINT "PK_840ef4bcf19b6c73542e1840d5e" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "subject_teachers" ADD "schoolId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "subject_teachers" ADD "subjectId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "subject_teachers" ADD "schoolMemberId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "classrooms" ALTER COLUMN "location" TYPE geometry`);
        await queryRunner.query(`ALTER TABLE "schools" ALTER COLUMN "location" TYPE geometry(Point)`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_bd79e43ab9b660c56ffb766377c" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_42d795ec552fb55e76e9986a862" FOREIGN KEY ("lectureId") REFERENCES "lectures"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_8770bd9030a3d13c5f79a7d2e81" FOREIGN KEY ("parentId") REFERENCES "comments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_4548cc4a409b8651ec75f70e280" FOREIGN KEY ("authorId") REFERENCES "school_members"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "class_students" ADD CONSTRAINT "FK_e1e05c87175f4971be5cf038b0b" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subject_teachers" ADD CONSTRAINT "FK_c55be1b24300729022e9323fa4f" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subject_teachers" ADD CONSTRAINT "FK_0d3c07de447fa1e89202c971d78" FOREIGN KEY ("subjectId") REFERENCES "subjects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subject_teachers" ADD CONSTRAINT "FK_69f4f579d388729be5091e705eb" FOREIGN KEY ("schoolMemberId") REFERENCES "school_members"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subject_teachers" DROP CONSTRAINT "FK_69f4f579d388729be5091e705eb"`);
        await queryRunner.query(`ALTER TABLE "subject_teachers" DROP CONSTRAINT "FK_0d3c07de447fa1e89202c971d78"`);
        await queryRunner.query(`ALTER TABLE "subject_teachers" DROP CONSTRAINT "FK_c55be1b24300729022e9323fa4f"`);
        await queryRunner.query(`ALTER TABLE "class_students" DROP CONSTRAINT "FK_e1e05c87175f4971be5cf038b0b"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_4548cc4a409b8651ec75f70e280"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_8770bd9030a3d13c5f79a7d2e81"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_42d795ec552fb55e76e9986a862"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_bd79e43ab9b660c56ffb766377c"`);
        await queryRunner.query(`ALTER TABLE "schools" ALTER COLUMN "location" TYPE geometry(POINT,0)`);
        await queryRunner.query(`ALTER TABLE "classrooms" ALTER COLUMN "location" TYPE geometry(GEOMETRY,0)`);
        await queryRunner.query(`ALTER TABLE "subject_teachers" DROP COLUMN "schoolMemberId"`);
        await queryRunner.query(`ALTER TABLE "subject_teachers" DROP COLUMN "subjectId"`);
        await queryRunner.query(`ALTER TABLE "subject_teachers" DROP COLUMN "schoolId"`);
        await queryRunner.query(`ALTER TABLE "subject_teachers" DROP CONSTRAINT "PK_840ef4bcf19b6c73542e1840d5e"`);
        await queryRunner.query(`ALTER TABLE "subject_teachers" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "class_students" DROP COLUMN "schoolId"`);
        await queryRunner.query(`ALTER TABLE "subject_teachers" ADD "schoolMembersId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "subject_teachers" ADD CONSTRAINT "PK_74011f8490d13c92ee9bb9c0138" PRIMARY KEY ("schoolMembersId")`);
        await queryRunner.query(`ALTER TABLE "subject_teachers" ADD "subjectsId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "subject_teachers" DROP CONSTRAINT "PK_74011f8490d13c92ee9bb9c0138"`);
        await queryRunner.query(`ALTER TABLE "subject_teachers" ADD CONSTRAINT "PK_0e62cb869ca1ab55bece9acc59e" PRIMARY KEY ("subjectsId", "schoolMembersId")`);
        await queryRunner.query(`DROP TABLE "comments"`);
        await queryRunner.query(`CREATE INDEX "IDX_02fbf0a593253d6360c2998c51" ON "subject_teachers" ("subjectsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_74011f8490d13c92ee9bb9c013" ON "subject_teachers" ("schoolMembersId") `);
        await queryRunner.query(`ALTER TABLE "subject_teachers" ADD CONSTRAINT "FK_74011f8490d13c92ee9bb9c0138" FOREIGN KEY ("schoolMembersId") REFERENCES "school_members"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subject_teachers" ADD CONSTRAINT "FK_02fbf0a593253d6360c2998c517" FOREIGN KEY ("subjectsId") REFERENCES "subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
